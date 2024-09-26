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
import { carColours, carData } from "@/app/profile/[id]/CarData";
import { useOptimistic, useState } from "react";
import axios from "axios";
import FailureToast from "@/components/FailureToast";
import SuccessToast from "@/components/SuccessToast";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { User } from "prisma/prisma-client";

interface Props {
  user: User;
}

function NewDriverForm({ user }: Props) {
  const carInfo = user.carInfo ? user.carInfo.split(" ") : undefined;
  const carMake = carInfo ? carInfo[0] : undefined;
  const carModel = carInfo ? carInfo.slice(1, -1) : undefined;
  const carColour = carInfo ? carInfo[carInfo.length - 1] : undefined;

  const [selectedMake, setSelectedMake] = useState<string | undefined>(carMake);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useOptimistic(false, () => true);

  // @ts-ignore
  const carModels = selectedMake ? carData[selectedMake] : null;

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
      await axios.patch(`/api/user/${user.id}`, {
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
      FailureToast("Could not update data", e.response.data.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit Driver Info</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Driver Info</DialogTitle>
          <DialogDescription>
            To become a driver you must enter some info for passengers. Please make sure
            all info is correct
          </DialogDescription>
        </DialogHeader>

        <form action={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Full Name
              </Label>
              <Input
                defaultValue={user.fullName ?? undefined}
                required
                name="fullName"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone Number
              </Label>
              <Input
                defaultValue={user.phoneNumber ?? undefined}
                required
                name="phoneNumber"
                className="col-span-3"
              />
            </div>

            <div className={"grid grid-cols-2 items-center gap-3"}>
              <div>
                <Label htmlFor={"carModel"} className="text-right">
                  Car Make
                </Label>
                <Select
                  required
                  name={"carMake"}
                  defaultValue={carMake}
                  onValueChange={(value) => {
                    setSelectedMake(value);
                  }}>
                  <SelectTrigger>
                    <SelectValue className={"w-100"} />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.keys(carData).map((make) => (
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
                <Select
                  required
                  defaultValue={carModel ? carModel.join(" ") : undefined}
                  name={"carModel"}>
                  <SelectTrigger>
                    <SelectValue className={"w-100"} />
                  </SelectTrigger>
                  <SelectContent>
                    {/*//@ts-ignore*/}
                    {carModels?.map((car) => (
                      <SelectItem key={car} value={car}>
                        {car}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={"carColour"} className="text-right">
                  Car Color
                </Label>
                <Select name={"carColour"} defaultValue={carColour} required>
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
                <Input
                  defaultValue={user.licencePlate ?? undefined}
                  required
                  name="licencePlate"
                  className="col-span-3"
                />
              </div>
            </div>
            <div className={"grid grid-cols-4 items-center gap-4"}>
              <Label htmlFor="carSeats" className="text-right">
                Car Seats (excluding driver)
              </Label>
              <Input
                defaultValue={user.carSeats ?? undefined}
                max={12}
                min={0}
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
