import { NextResponse } from "next/server";
import { AppError, ValidationError } from "@/app/api/_core/errors";

export async function handleRoute<T>(fn: () => Promise<T | Response>) {
  try {
    const data = await fn();
    if (data instanceof Response) {
      return data;
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          details: error instanceof ValidationError ? error.details : undefined,
        },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { error: `Internal server error: ${error}` },
      { status: 500 },
    );
  }
}
