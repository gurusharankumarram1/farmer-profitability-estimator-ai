import { ZodSchema, ZodError } from "zod";
import { errorResponse } from "@/utils/response";

/**
 * Validates an object against a Zod schema.
 * Returns either the parsed data or an error response with details.
 */
export function validateBody<T>(
  schema: ZodSchema<T>,
  data: unknown
): { data: T } | { error: ReturnType<typeof errorResponse> } {
  try {
    const parsed = schema.parse(data);
    return { data: parsed };
  } catch (err) {
    if (err instanceof ZodError) {
      const messages = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
      return { error: errorResponse(`Validation failed: ${messages}`, 400) };
    }
    return { error: errorResponse("Validation failed.", 400) };
  }
}
