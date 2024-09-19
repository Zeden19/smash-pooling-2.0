import { Separator } from "@/components/ui/separator";
import { validateRequest } from "@/app/hooks/validateRequest";
import {
  ArmchairIcon,
  CarIcon,
  IdCardIcon,
  MailIcon,
  PhoneIcon,
  TagIcon,
} from "lucide-react";

export async function UserInfo() {
  const { user } = await validateRequest();
  return (
    <div className={"m-8 flex flex-col gap-3"}>
      <img
        className={"rounded-full"}
        alt={"Profile Picture"}
        src={user?.profilePicture ?? ""}
        width={300}
        height={300}
      />
      <h1 className={"text-5xl font-bold"}>{user?.gamertag}</h1>
      <div className={"flex gap-2"}>
        <MailIcon />
        <p>{user?.email}</p>
      </div>
      <div className={"flex gap-2"}>
        <TagIcon />
        <p>Name or Gamer tag here</p>
      </div>
      <div className={"flex gap-2"}>
        <PhoneIcon />
        <p>Phone Number here</p>
      </div>

      <Separator className={"w-56"} />
      <h1 className={"text-2xl font-bold"}>Driver Info</h1>
      <div className={"flex gap-2"}>
        <img
          className={"rounded-full"}
          alt={"Profile Picture"}
          src={user?.profilePicture ?? ""}
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
    </div>
  );
}