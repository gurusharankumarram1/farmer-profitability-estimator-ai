import { NextRequest } from "next/server";
import { verifyToken, TokenPayload } from "@/utils/token";
import { errorResponse } from "@/utils/response";

export interface AuthenticatedRequest extends NextRequest {
  user?: TokenPayload;
}

/**
 * Extracts and verifies JWT from the Authorization header.
 * Returns the decoded user payload or an error response.
 */
export async function authenticateUser(
  req: NextRequest
): Promise<{ user: TokenPayload } | { error: ReturnType<typeof errorResponse> }> {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: errorResponse("Authentication required. Please provide a valid token.", 401) };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    return { user: decoded };
  } catch {
    return { error: errorResponse("Invalid or expired token.", 401) };
  }
}
