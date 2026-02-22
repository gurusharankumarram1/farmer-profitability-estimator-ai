import { errorResponse } from "@/utils/response";

/**
 * Global error handler — wraps async route handlers to catch unhandled errors.
 */
export function handleError(error: unknown) {
  console.error("[API Error]", error);

  if (error instanceof Error) {
    // Mongoose validation error
    if (error.name === "ValidationError") {
      return errorResponse("Validation failed: " + error.message, 400);
    }

    // Mongoose duplicate key error
    if (error.name === "MongoServerError" && (error as Error & { code?: number }).code === 11000) {
      return errorResponse("Duplicate entry. This record already exists.", 409);
    }

    return errorResponse(error.message, 500);
  }

  return errorResponse("An unexpected error occurred.", 500);
}
