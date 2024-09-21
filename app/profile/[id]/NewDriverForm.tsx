"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { carColours, carMakes } from "@/app/profile/[id]/CarData";
import { useState } from "react";
import axios from "axios";
import FailureToast from "@/components/FailureToast";
import SuccessToast from "@/components/SuccessToast";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface Props {
  carData: { Year: number; Make: string; Model: string; Category: string }[];
  userId: string;
}

function NewDriverForm({ carData, userId }: Props) {
  const [selectedMake, setSelectedMake] = useState<string>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const carModels = selectedMake
    ? carData.filter((car) => car.Make === selectedMake)
    : null;

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const fullName = formData.get("fullName");
    const phoneNumber = formData.get("phoneNumber");
    const carModel = formData.get("carModel");
    const carMake = formData.get("carMake");
    const carColour = formData.get("carColour");
    const carSeats = formData.get("carSeats") as string;
    const licencePlate = formData.get("licencePlate");

    try {
      await axios.patch(`/api/user/${userId}`, {
        fullName,
        phoneNumber,
        carModel,
        carMake,
        carColour,
        carSeats: parseInt(carSeats),
        licencePlate,
      });
      SuccessToast("Successfully updated data", "Get driving!");
      setOpen(false);
    } catch (e: any) {
      FailureToast("Could not update data", e.response.data.error.issues[0].message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Become Driver</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Become Driver</DialogTitle>
          <DialogDescription>
            To become a driver you must enter some info for passengers. Please maker sure
            all info is correct
          </DialogDescription>
        </DialogHeader>

        <form action={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Full Name
              </Label>
              <Input required name="fullName" className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone Number
              </Label>
              <Input required name="phoneNumber" className="col-span-3" />
            </div>

            <div className={"grid grid-cols-2 items-center gap-3"}>
              <div>
                <Label htmlFor={"carModel"} className="text-right">
                  Car Make
                </Label>
                <Select
                  required
                  name={"carMake"}
                  onValueChange={(value) => {
                    setSelectedMake(value);
                  }}>
                  <SelectTrigger>
                    <SelectValue className={"w-100"} />
                  </SelectTrigger>

                  <SelectContent>
                    {carMakes.map((make) => (
                      <SelectItem key={make} value={make}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={"carModel"} className="text-right">
                  Car Model
                </Label>
                <Select required name={"carModel"}>
                  <SelectTrigger>
                    <SelectValue className={"w-100"} />
                  </SelectTrigger>
                  <SelectContent>
                    {carModels?.map((car) => (
                      <SelectItem
                        key={car.Model + " " + car.Year}
                        value={car.Model + " " + car.Year}>
                        {car.Model + " " + car.Year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={"carColour"} className="text-right">
                  Car Color
                </Label>
                <Select name={"carColour"} required>
                  <SelectTrigger>
                    <SelectValue className={"w-100"} />
                  </SelectTrigger>
                  <SelectContent>
                    {carColours.map((colour) => (
                      <SelectItem key={colour} value={colour}>
                        {colour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="licencePlate" className="text-right">
                  Licence Plate
                </Label>
                <Input required name="licencePlate" className="col-span-3" />
              </div>
            </div>
            <div className={"grid grid-cols-4 items-center gap-4"}>
              <Label htmlFor="carSeats" className="text-right">
                Car Seats (excluding driver)
              </Label>
              <Input
                min={0}
                max={12}
                required
                name="carSeats"
                type={"number"}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={loading} type="submit">
              Submit {loading && <LoadingSpinner />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewDriverForm;
