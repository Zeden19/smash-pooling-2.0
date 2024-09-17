import { Prisma } from "@prisma/client";

// this file is needed because "Decimal" types (which are needed in Prisma to use decimal values)
// are not compatible with native JS number types, resulting in errors when trying to place markers using
// the Decimal values. Its a workaround, something on Prisma's side that is funky.

export function DecimalToNumber(value: Prisma.Decimal): number {
  return new Prisma.Decimal(value).toNumber();
}

export function NumberToDecimal(value: number): Prisma.Decimal {
  return new Prisma.Decimal(value);
}
