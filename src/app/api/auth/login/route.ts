import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getMaxAgeFromToken } from "@/app/auth_utils";

export async function POST(req: Request) {
  const baseUrl = process.env.VALIDATION_SERVICE_URL;

  if (!baseUrl) {
    console.error("VALIDATION_SERVICE_URL is not defined");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("Login service unreachable:", err);
    return NextResponse.json({ error: "Service unavailable" }, { status: 502 });
  }

  if (!res.ok) {
    const status = res.status >= 400 && res.status < 500 ? res.status : 502;
    return NextResponse.json({ error: "Login failed" }, { status });
  }

  type LoginResponse = {
    token?: {
      access_token?: string;
      refresh_token?: string;
    };
  };

  const data: LoginResponse = await res.json();

  const accessToken = data?.token?.access_token;
  const refreshToken = data?.token?.refresh_token;

  if (!accessToken || !refreshToken) {
    console.error("Unexpected login response shape:", data);
    return NextResponse.json(
      { error: "Invalid auth response" },
      { status: 502 },
    );
  }

  let accessMaxAge: number;
  try {
    accessMaxAge = getMaxAgeFromToken(accessToken);
  } catch (err) {
    console.error("Invalid access token:", err);
    return NextResponse.json(
      { error: "Invalid token from auth server" },
      { status: 502 },
    );
  }

  let refreshMaxAge = 60 * 60 * 24 * 7; // fallback (7 days)
  try {
    refreshMaxAge = getMaxAgeFromToken(refreshToken);
  } catch {
    console.warn("Refresh token is not JWT or missing exp, using fallback");
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  const cookieStore = await cookies();

  cookieStore.set("access_token", accessToken, {
    ...cookieOptions,
    maxAge: accessMaxAge,
  });

  cookieStore.set("refresh_token", refreshToken, {
    ...cookieOptions,
    maxAge: refreshMaxAge,
  });

  return NextResponse.json({ success: true });
}

// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// // Can't use API client because it is on client
// export async function POST(req: Request) {
//   const body = await req.json();

//   // TODO: Log error if undefined
//   const baseUrl = process.env.NEXT_PUBLIC_VALIDATION_SERVICE_URL;

//   const res = await fetch(`${baseUrl}/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });

//   if (!res.ok) {
//     return NextResponse.json({ error: "Login failed" }, { status: 401 });
//   }

//   const data = await res.json();

//   const token = data.token.access_token;
//   const refreshToken = data.token.refresh_token;

//   const cookieStore = await cookies();
//   cookieStore.set("access_token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//     maxAge: 60 * 60 * 24, // short-lived // TODO: Make configurable with env variable with default
//   });

//   cookieStore.set("refresh_token", refreshToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//     maxAge: 60 * 60 * 24 * 7, // longer-lived, e.g. 7 days
//   });

//   return NextResponse.json({ success: true });
// }
