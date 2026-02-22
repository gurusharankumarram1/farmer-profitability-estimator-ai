import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-do-not-use-in-production";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: TokenPayload): string {
  const expiresInSeconds = 7 * 24 * 60 * 60;
  return jwt.sign(payload as object, JWT_SECRET, { expiresIn: expiresInSeconds });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
