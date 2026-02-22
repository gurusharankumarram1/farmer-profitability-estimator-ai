import { NextRequest } from "next/server";
import { AuthService } from "@/services/auth.service";
import { validateBody } from "@/middleware/validation.middleware";
import { handleError } from "@/middleware/error.middleware";
import { registerSchema, loginSchema } from "@/validations/schemas";
import { successResponse, errorResponse } from "@/utils/response";
import { z } from "zod";

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export class AuthController {
  /**
   * POST /api/auth/register
   */
  static async register(req: NextRequest) {
    try {
      const body = await req.json();

      const validation = validateBody(registerSchema, body);
      if ("error" in validation) return validation.error;

      const result = await AuthService.register(validation.data);
      return successResponse(result, "Registration initiated. OTP sent.", 201);
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        return errorResponse(error.message, 409);
      }
      return handleError(error);
    }
  }

  /**
   * POST /api/auth/verify-otp
   */
  static async verifyOtp(req: NextRequest) {
    try {
      const body = await req.json();

      const validation = validateBody(verifyOtpSchema, body);
      if ("error" in validation) return validation.error;

      const result = await AuthService.verifyOtp(validation.data.email, validation.data.otp);
      return successResponse(result, "OTP Verified successfully.", 200);
    } catch (error) {
      if (error instanceof Error && error.message.includes("OTP")) {
        return errorResponse(error.message, 400);
      }
      return handleError(error);
    }
  }

  /**
   * POST /api/auth/login
   */
  static async login(req: NextRequest) {
    try {
      const body = await req.json();

      const validation = validateBody(loginSchema, body);
      if ("error" in validation) return validation.error;

      const result = await AuthService.login(validation.data);
      return successResponse(result, "Login successful.");
    } catch (error) {
      if (error instanceof Error && error.message.includes("Invalid email or password")) {
        return errorResponse(error.message, 401);
      }
      return handleError(error);
    }
  }
}
