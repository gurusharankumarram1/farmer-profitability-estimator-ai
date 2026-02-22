import { NextRequest } from "next/server";
import { AuthController } from "@/controllers/auth.controller";

/**
 * POST /api/auth/verify-otp
 * Verifies the OTP and activates the user account.
 */
export async function POST(req: NextRequest) {
  return AuthController.verifyOtp(req);
}
