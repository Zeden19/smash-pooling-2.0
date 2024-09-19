import { validateRequest } from "@/app/hooks/validateRequest";
import { Separator } from "@/components/ui/separator";
import {
  ArmchairIcon,
  CarIcon,
  IdCardIcon,
  MailIcon,
  PhoneIcon,
  TagIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function ProfilePage() {
  const { user } = await validateRequest();
  return (
    <div className={"flex gap-16"}>
      {/*Left side*/}
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

      {/*Right Side*/}
      <div className={"mt-7 flex flex-col gap-5"}>
        <h1 className={"text-5xl font-bold"}>Carpool Info</h1>

        <div>
          <h3 className={"text-2xl font-bold"}>Carpools Driving/Driven</h3>
          <Table className={"bg-slate-900 rounded m-2 w-[800px]"}>
            <TableHeader>
              <TableRow>
                <TableHead>Tournament</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Starting Time</TableHead>
                <TableHead>Seats Available</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <a
                    target={"_blank"}
                    href={"https://www.start.gg/tournament/bullet-hell-1/details"}>
                    Bullet Hell
                  </a>
                </TableCell>
                <TableCell>Toronto</TableCell>
                <TableCell>London</TableCell>
                <TableCell>6:00PM</TableCell>
                <TableCell>3</TableCell>
                <TableCell>50km</TableCell>
                <TableCell>Open</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div>
          <h3 className={"text-2xl font-bold"}>Carpools Attending/Attended</h3>
          <Table className={"bg-slate-900 rounded m-2 w-[800px]"}>
            <TableHeader>
              <TableRow>
                <TableHead>Tournament</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Starting Time</TableHead>
                <TableHead>Seats Available</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <a
                    target={"_blank"}
                    href={"https://www.start.gg/tournament/bullet-hell-1/details"}>
                    Bullet Hell
                  </a>
                </TableCell>
                <TableCell>Toronto</TableCell>
                <TableCell>London</TableCell>
                <TableCell>6:00PM</TableCell>
                <TableCell>3</TableCell>
                <TableCell>50km</TableCell>
                <TableCell>Open</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
