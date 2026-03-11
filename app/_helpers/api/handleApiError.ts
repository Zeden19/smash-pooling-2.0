"use client";

import axios from "axios";
import FailureToast from "@/app/_components/toast/FailureToast";

type ApiErrorPayload = { error?: string; details?: unknown } | string | undefined;

function findFirstError(details: unknown): string | null {
  if (!details || typeof details !== "object") return null;
  const record = details as Record<string, any>;
  if (Array.isArray(record._errors) && record._errors.length > 0) {
    return record._errors[0];
  }
  for (const value of Object.values(record)) {
    if (value && typeof value === "object") {
      const nested = findFirstError(value);
      if (nested) return nested;
    }
  }
  return null;
}

export function handleApiError(
  error: unknown,
  fallbackTitle = "Something went wrong",
  fallbackDescription = "Please try again",
) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorPayload;
    if (typeof data === "string") {
      return FailureToast(fallbackTitle, data);
    }
    if (data && typeof data === "object") {
      const details = findFirstError((data as { details?: unknown }).details);
      if ((data as { error?: string }).error && details) {
        return FailureToast(
          fallbackTitle,
          `${(data as { error?: string }).error}: ${details}`,
        );
      }
      if ((data as { error?: string }).error) {
        return FailureToast(fallbackTitle, (data as { error?: string }).error);
      }
      if (details) {
        return FailureToast(fallbackTitle, details);
      }
    }
  }

  return FailureToast(fallbackTitle, fallbackDescription);
}
