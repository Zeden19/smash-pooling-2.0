import { ArmchairIcon, CarIcon, IdCardIcon } from "lucide-react";
import { User } from "prisma/prisma-client";

export function DriverInfo({ driver }: { driver: User }) {
  return (
    <div>
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
          <p>{driver.carInfo}</p>
        </div>
        <div className={"flex gap-2"}>
          <IdCardIcon />
          <p>{driver.licencePlate}</p>
        </div>
        <div className={"flex gap-2"}>
          <ArmchairIcon />
          <p>{driver.carSeats} seat(s) (Excluding Driver)</p>
        </div>
      </>
    </div>
  );
}
