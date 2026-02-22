/**
 * Reusable API helper with automatic JWT attachment and error handling.
 */

import { getToken, logout } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message: string;
  error: string | null;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json: ApiResponse<T> = await res.json();

  // Handle 401 — token expired or invalid
  if (res.status === 401) {
    logout();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiError(json.message || "Session expired. Please login again.", 401);
  }

  if (!res.ok) {
    throw new ApiError(json.message || "Something went wrong.", res.status);
  }

  return json;
}

// ── Auth endpoints ──
export function registerUser(data: { name: string; email: string; password: string }) {
  return request<{ message: string; email: string; isOtpRequired: boolean }>(
    "/api/auth/register",
    { method: "POST", body: JSON.stringify(data) }
  );
}

export function verifyOtpUser(data: { email: string; otp: string }) {
  return request<{ token: string; user: { id: string; name: string; email: string } }>(
    "/api/auth/verify-otp",
    { method: "POST", body: JSON.stringify(data) }
  );
}

export function loginUser(data: { email: string; password: string }) {
  return request<{ token: string; user: { id: string; name: string; email: string } }>(
    "/api/auth/login",
    { method: "POST", body: JSON.stringify(data) }
  );
}

// ── Estimate endpoint ──
export interface EstimatePayload {
  cropId: string;
  regionId: string;
  landSizeAcres: number;
  irrigationType: string;
  costs: {
    seeds: number;
    fertilizer: number;
    pesticides: number;
    labor: number;
    irrigation: number;
    equipment: number;
    transport: number;
    miscellaneous: number;
  };
}

export interface EstimateResult {
  expectedYield: number;
  selectedPrice: number;
  revenue: number;
  totalCost: number;
  netProfit: number;
  riskScore: number;
  riskBreakdown: {
    weatherRisk: number;
    priceVolatilityRisk: number;
    irrigationReliabilityRisk: number;
    yieldVarianceRisk: number;
  };
}

export function submitEstimate(data: EstimatePayload) {
  return request<EstimateResult>("/api/estimate", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Fetch past estimations for the logged-in user.
 */
export async function fetchEstimateHistory(): Promise<ApiResponse<any[]>> {
  return request<any[]>("/api/estimate", {
    method: "GET",
  });
}

export interface RefCrop { id: string; name: string; category: string }
export interface RefRegion { id: string; name: string; state: string; district: string }
export interface RefIrrigation { id: string; type: string; multiplier: number }

export interface ReferenceData {
  crops: RefCrop[];
  regions: RefRegion[];
  irrigationTypes: RefIrrigation[];
  cropRegionMap?: Record<string, string[]>;
}

export function fetchReferenceData() {
  return request<ReferenceData>("/api/reference-data", { method: "GET" });
}

// ── Seed endpoint ──
export function seedDatabase() {
  return request<{ seeded: boolean }>("/api/seed", { method: "POST" });
}
