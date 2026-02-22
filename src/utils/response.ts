import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message: string;
  error: string | null;
}

export function successResponse<T>(data: T, message = "Success", status = 200) {
  const body: ApiResponse<T> = {
    success: true,
    data,
    message,
    error: null,
  };
  return NextResponse.json(body, { status });
}

export function errorResponse(message: string, status = 500, error?: string) {
  const body: ApiResponse<null> = {
    success: false,
    data: null,
    message,
    error: error ?? message,
  };
  return NextResponse.json(body, { status });
}
