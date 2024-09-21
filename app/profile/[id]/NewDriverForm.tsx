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
import carMakes from "@/app/profile/[id]/CarMakes";
import { useState } from "react";

interface Props {
  carData: { Year: number; Make: string; Model: string; Category: string }[];
}

function NewDriverForm({ carData }: Props) {
  const [selectedMake, setSelectedMake] = useState<string>();
  const carModels = selectedMake
    ? carData.filter((car) => car.Make === selectedMake)
    : null;
  //prettier-ignore
  const carColours = ["Black", "White", "Silver", "Red", "Blue", "Yellow", "Green", "Orange", "Brown", "Purple"];

  return (
    <Dialog>
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

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Full Name
            </Label>
            <Input required id="name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right">
              Phone Number
            </Label>
            <Input required id="phoneNumber" className="col-span-3" />
          </div>

          <div className={"grid grid-cols-2 items-center gap-3"}>
            <div>
              <Label className="text-right">Car Make</Label>
              <Select
                required
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
              <Label className="text-right">Car Model</Label>
              <Select required>
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
              <Label className="text-right">Car Color</Label>
              <Select required>
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
              <Label htmlFor="carSeats" className="text-right">
                Car Seats (excluding driver)
              </Label>
              <Input required id="name" type={"number"} className="col-span-3" />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewDriverForm;
