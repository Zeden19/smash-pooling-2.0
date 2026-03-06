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
import { carColours, carData, CarMakes } from "@/app/profile/[id]/CarData";
import { useOptimistic, useState } from "react";
import axios from "axios";
import FailureToast from "@/app/_components/toast/FailureToast";
import SuccessToast from "@/app/_components/toast/SuccessToast";
import { LoadingSpinner } from "@/app/_components/LoadingSpinner";
import { User } from "@/prisma/generated/prisma/client";
import { z } from "zod";

const driverSchema = z.object({
  fullName: z
    .string({ message: "Name is required" })
    .min(3, { message: "Name must be longer than 3 characters" })
    .max(40, { message: "Name must be smaller than 40 characters" }),
  phoneNumber: z
    .string({ message: "Phone number is required" })
    .min(4, { message: "Phone number must be larger than 4 characters" })
    .max(22, { message: "Phone number must be smaller than 23 characters" }),
  carMake: z.enum(Object.keys(carData) as [CarMakes], { message: "Invalid car make" }),
  carModel: z.string({ message: "Car model is required" }),
  carColour: z.enum(carColours, { message: "Invalid car colour" }),
  licencePlate: z
    .string({ message: "Licence Plate is required" })
    .min(6, { message: "Licence Plate must be longer than 6 characters" })
    .max(12, { message: "Licence Plate must be shorter than 13 characters" }),
  carSeats: z
    .number({ message: "Car Seats is required" })
    .min(1, { message: "Car seats must be greater than 1" })
    .max(12, { message: "Car seats must be smaller than 13" }),
});

interface Props {
  user: User;
  setUser: (user: User) => void;
}

function NewDriverForm({ user, setUser }: Props) {
  const carInfo = user.carInfo ? user.carInfo.split(" ") : undefined;
  const carMake = carInfo ? (carInfo[0] as CarMakes) : undefined;
  const carModel = carInfo ? carInfo.slice(1, -1) : undefined;
  const carColour = carInfo ? carInfo[carInfo.length - 1] : undefined;

  const [selectedMake, setSelectedMake] = useState<CarMakes | undefined>(carMake);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useOptimistic(false, () => true);

  const carModels = selectedMake ? carData[selectedMake] : null;

  async function onSubmit(formData: FormData) {
    setLoading(true);

    const body = {
      fullName: formData.get("fullName"),
      phoneNumber: formData.get("phoneNumber"),
      carModel: formData.get("carModel"),
      carMake: formData.get("carMake"),
      carColour: formData.get("carColour"),
      carSeats: parseInt(formData.get("carSeats") as string),
      licencePlate: formData.get("licencePlate"),
    };

    const validation = driverSchema.safeParse(body);
    if (validation.error) {
      FailureToast("Fields Error", JSON.parse(validation.error.message)[0].message);
      return;
    }

    try {
      const { data } = await axios.patch(`/api/user/${user.id}`, validation.data);
      SuccessToast("Successfully updated data", "Get driving!");
      setUser(data);
      setOpen(false);
    } catch (e) {
      console.error(e);
      FailureToast("Could not update data", "Please try again");
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
                id={"fullName"}
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
                id={"phoneNumber"}
                name="phoneNumber"
                className="col-span-3"
              />
            </div>

            <div className={"grid grid-cols-2 items-center gap-3"}>
              <div>
                <Label htmlFor={"carMake"} className="text-right">
                  Car Make
                </Label>
                <Select
                  required
                  name={"carMake"}
                  defaultValue={carMake}
                  onValueChange={(value: CarMakes) => {
                    setSelectedMake(value);
                  }}>
                  <SelectTrigger id={"carMake"}>
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
                  <SelectTrigger id={"carModel"}>
                    <SelectValue className={"w-100"} />
                  </SelectTrigger>
                  <SelectContent>
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
                  <SelectTrigger id={"carColour"}>
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
                  id={"licencePlate"}
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
                id={"carSeats"}
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
