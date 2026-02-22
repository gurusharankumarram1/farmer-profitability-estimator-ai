// This route is served by sub-routes: /api/auth/login and /api/auth/register
// This file exists as a placeholder. Direct requests to /api/auth return 404.
import { errorResponse } from "@/utils/response";

export async function GET() {
  return errorResponse("Use /api/auth/login or /api/auth/register", 404);
}

export async function POST() {
  return errorResponse("Use /api/auth/login or /api/auth/register", 404);
}
