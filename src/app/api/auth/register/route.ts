import { NextRequest } from "next/server";
import { AuthController } from "@/controllers/auth.controller";

/**
 * POST /api/auth/register
 *
 * Public endpoint — creates a new user account.
 *
 * Body: { name, email, password, role? }
 * Returns: { token, user }
 */
export async function POST(req: NextRequest) {
  return AuthController.register(req);
}
