/**
 * TODO: Move this to the UI library.
 */

import { decodeJwt } from "jose";

export function getMaxAgeFromToken(token: string): number {
  const payload = decodeJwt(token);

  if (!payload.exp) {
    throw new Error("Token missing exp claim");
  }

  const now = Math.floor(Date.now() / 1000);

  return Math.max(payload.exp - now, 0);
}
