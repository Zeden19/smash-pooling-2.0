import { z } from "zod";
import { ValidationError } from "@/app/api/_core/errors";

export async function parseBody<T extends z.ZodTypeAny>(
  req: Request,
  schema: T,
): Promise<z.infer<T>> {
  const data = await req.json();
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError("Invalid request body", result.error.format());
  }
  return result.data;
}
