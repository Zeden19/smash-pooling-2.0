import {
  AuthError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/app/api/_core/errors";

export function badRequest(message: string, details?: unknown): never {
  throw new ValidationError(message, details);
}

export function unauthorized(message = "Authentication required"): never {
  throw new AuthError(message);
}

export function forbidden(message = "Access denied"): never {
  throw new ForbiddenError(message);
}

export function notFound(message = "Not found"): never {
  throw new NotFoundError(message);
}
