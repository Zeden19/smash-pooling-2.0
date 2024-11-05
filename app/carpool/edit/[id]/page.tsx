import prisma from "@/prisma/prismaClient";
import { redirect } from "next/navigation";
import GoogleMap from "@/components/GoogleMap";
import MapElements from "@/app/carpool/[id]/MapElements";
import carpoolDecimalToNumber from "@/app/helpers/services/carpoolDecimalToNumber";
import { makeTitle } from "@/app/helpers/services/makeTitle";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface Props {
  params: { id: string };
}

async function EditCarpoolDetails({ params: { id } }: Props) {
  const carpool = await prisma.carpool.findUnique({ where: { id: parseInt(id) } });

  if (!carpool) return redirect("/carpool/edit");
  const carpoolNumber = carpoolDecimalToNumber([carpool])[0];

  const data = [
    {
      label: "Tournament",
      value: (
        <Input
          defaultValue={makeTitle(carpool.tournamentSlug)}
          placeholder={"Tournament"}></Input>
      ),
    },
    {
      label: "Origin",
      value: <Input defaultValue={carpool.originName} placeholder={"Origin"}></Input>,
    },
    {
      label: "Description",
      value: <Textarea placeholder={"Description"}>{carpool.description}</Textarea>,
    },
    {
      label: "Price",
      value: <Input defaultValue={carpool.price} placeholder={"Price"}></Input>,
    },
  ];

  return (
    <div className="m-4">
      <h2 className="text-4xl font-bold mb-3">Edit Carpool Info</h2>

      <div className="flex justify-between">
        <div className="w-2/5">
          {data.map((info) => (
            <div className="flex gap-3 items-center mb-2" key={info.label}>
              <span className="font-bold w-24 text-right">{info.label}:</span>
              <div className="flex-1">{info.value}</div>
            </div>
          ))}
        </div>

        <div className="w-1/2 flex justify-end items-start">
          <GoogleMap className="mr-5" size={{ width: "50vw", height: "50vh" }} />
        </div>
      </div>

      <MapElements carpool={carpoolNumber} />
    </div>
  );
}

export default EditCarpoolDetails;
