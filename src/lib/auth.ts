/**
 * Auth utility — JWT token management.
 *
 * Best practice: httpOnly cookies are more secure (immune to XSS).
 * However, since Next.js App Router API routes run server-side and
 * we need client-side access for SPA-style auth, we use localStorage
 * with proper 401 handling. For production, consider migrating to
 * httpOnly cookie via a /api/auth/session proxy route.
 */

const TOKEN_KEY = "farmer_estimator_token";
const USER_KEY = "farmer_estimator_user";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
}

export function saveAuth(token: string, user: StoredUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
