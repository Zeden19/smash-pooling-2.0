import { Carpool } from "prisma/prisma-client";
import { DecimalToNumber } from "@/app/_helpers/functions/DecimalConversions";

function carpoolDecimalToNumber(carpools: Carpool[]) {
  return carpools.map((carpool) => ({
    ...carpool,
    originLat: DecimalToNumber(carpool.originLat),
    originLng: DecimalToNumber(carpool.originLng),
    destinationLat: DecimalToNumber(carpool.destinationLat),
    destinationLng: DecimalToNumber(carpool.destinationLng),
  }));
}

export default carpoolDecimalToNumber;