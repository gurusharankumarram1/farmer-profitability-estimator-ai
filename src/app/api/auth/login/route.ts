import { NextRequest } from "next/server";
import { AuthController } from "@/controllers/auth.controller";

/**
 * POST /api/auth/login
 *
 * Public endpoint — authenticates a user and returns a JWT.
 *
 * Body: { email, password }
 * Returns: { token, user }
 */
export async function POST(req: NextRequest) {
  return AuthController.login(req);
}
