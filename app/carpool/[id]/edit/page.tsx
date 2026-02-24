"use client";
import { useCarpool } from "@/app/carpool/[id]/CarpoolContext";
import React, { useEffect, useState } from "react";
import { mapProps } from "@/app/carpool/_maps/mapConfig";
import { makeTitle } from "@/app/_helpers/functions/makeTitle";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Map } from "@vis.gl/react-google-maps";

function EditPage() {
  const carpool = useCarpool();
  const [data, setData] = useState<{ label: string; value: React.ReactNode }[] | null>(
    null,
  );

  useEffect(() => {
    setData([
      {
        label: "Tournament",
        value: (
          <Input
            defaultValue={makeTitle(carpool.tournamentSlug)}
            placeholder={"Tournament"}
          />
        ),
      },
      {
        label: "Origin",
        value: <Input defaultValue={carpool.originName} placeholder={"Origin"} />,
      },
      {
        label: "Description",
        value: <Textarea placeholder={"Description"}>{carpool.description}</Textarea>,
      },
      {
        label: "Price",
        value: <Input defaultValue={carpool.price} placeholder={"Price"}></Input>,
      },
    ]);
  }, [carpool]);

  return (
    <div className="m-4">
      <h2 className="text-4xl font-bold mb-3">Edit Carpool Info</h2>

      <div className="flex justify-between">
        <div className="w-2/5">
          {data &&
            data.map((info) => (
              <div className="flex gap-3 items-center mb-2" key={info.label}>
                <span className="font-bold w-24 text-right">{info.label}:</span>
                <div className="flex-1">{info.value}</div>
              </div>
            ))}
        </div>

        <Map {...mapProps} style={{ width: "50vw", height: "50vh" }} />
      </div>
    </div>
  );
}

export default EditPage;
