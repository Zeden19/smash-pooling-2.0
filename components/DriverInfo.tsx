import { ArmchairIcon, CarIcon, IdCardIcon } from "lucide-react";
import { User } from "prisma/prisma-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DriverInfo({ driver }: { driver: User }) {
  return (
    <div>
      {driver.isDriver ? (
        <>
          <h1 className={"text-2xl font-bold mb-3"}>Driver Info</h1>
          <div className={"flex gap-2"}>
            <img
              className={"rounded-full"}
              alt={"Profile Picture"}
              src={driver?.profilePicture ?? ""}
              width={100}
              height={100}
            />
            <img
              className={"rounded-full"}
              alt={"Profile Picture"}
              src={"/basicCar.png"}
              width={100}
              height={100}
            />
          </div>
          <div className={"flex gap-2"}>
            <CarIcon />
            <p>Car Colour Make, and Model Here</p>
          </div>
          <div className={"flex gap-2"}>
            <IdCardIcon />
            <p>Licence Plate Here</p>
          </div>
          <div className={"flex gap-2"}>
            <ArmchairIcon />
            <p>Number of Seats (Exlcuding driver)</p>
          </div>
        </>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Become Driver</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Become Driver</DialogTitle>
              <DialogDescription>
                To become a driver you must enter some info for passengers. Please maker
                sure all info is correct
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Full Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phoneNumber" className="text-right">
                  Phone Number
                </Label>
                <Input id="phoneNumber" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Car Make</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue className={"w-100"} />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Car Make</SelectLabel>
                      <SelectItem value={"bmw"}>BMW</SelectItem>
                      <SelectItem value={"Ford"}>Ford</SelectItem>
                      <SelectItem value={"Honda"}>Honda</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Car Model</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue className={"w-100"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Car Model</SelectLabel>
                      <SelectItem value={"mini"}>Cooper</SelectItem>
                      <SelectItem value={"Ford"}>S class</SelectItem>
                      <SelectItem value={"Honda"}>Off-road</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Car Colour</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue className={"w-100"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Car Model</SelectLabel>
                      <SelectItem value={"mini"}>Black</SelectItem>
                      <SelectItem value={"Ford"}>Gray</SelectItem>
                      <SelectItem value={"Honda"}>Red</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="carSeats" className="text-right">
                  Car Seats (excluding driver)
                </Label>
                <Input id="name" type={"number"} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
