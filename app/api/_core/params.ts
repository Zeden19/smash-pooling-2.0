import { ValidationError } from "@/app/api/_core/errors";

export function parseId(value: string, field = "id"): number {
  const id = Number.parseInt(value, 10);
  if (Number.isNaN(id)) {
    throw new ValidationError(`Invalid ${field}`);
  }
  return id;
}
