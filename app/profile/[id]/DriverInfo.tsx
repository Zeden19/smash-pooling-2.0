import { ArmchairIcon, CarIcon, IdCardIcon } from "lucide-react";
import { User } from "prisma/prisma-client";
import GenericToolTip from "@/components/GenericToolTip";

export function DriverInfo({ driver }: { driver: User }) {
  return (
    <div>
      <>
        <h1 className={"text-2xl font-bold mb-3"}>Driver Info</h1>
        <div className={"flex gap-2"}>
          <GenericToolTip toolTipText={"Driver Picture"}>
            <img
              className={"rounded-full"}
              alt={"Profile Picture"}
              src={driver?.profilePicture ?? ""}
              width={100}
              height={100}
            />
          </GenericToolTip>

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
          <GenericToolTip toolTipText={"Car Info"}>
            <p>{driver.carInfo}</p>
          </GenericToolTip>
        </div>
        <div className={"flex gap-2"}>
          <IdCardIcon />
          <GenericToolTip toolTipText={"Licence Plate"}>
            <p>{driver.licencePlate}</p>
          </GenericToolTip>
        </div>
        <div className={"flex gap-2"}>
          <ArmchairIcon />
          <GenericToolTip toolTipText={"Seats Available"}>
            <p>{driver.carSeats} seat(s) (Excluding Driver)</p>
          </GenericToolTip>
        </div>
      </>
    </div>
  );
}
