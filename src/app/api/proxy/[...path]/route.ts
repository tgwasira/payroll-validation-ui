import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { PUBLIC_PROXY_ROUTES } from "@/constants/routeProtection";

export const runtime = "nodejs";

const BASE_URL = process.env.VALIDATION_SERVICE_URL;

const EXCLUDED_RESPONSE_HEADERS = [
  "transfer-encoding",
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "upgrade",
  "content-length",
];

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  if (!BASE_URL) {
    return NextResponse.json(
      { error: "Backend URL not configured" },
      { status: 503 },
    );
  }

  const { path } = await params;
  const pathStr = path?.join("/") ?? "";

  if (!pathStr) {
    return NextResponse.json({ error: "Missing proxy path" }, { status: 400 });
  }

  const isPublicApi = PUBLIC_PROXY_ROUTES.some(
    (p) => pathStr === p || pathStr.startsWith(`${p}/`),
  );

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token && !isPublicApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(`${BASE_URL}/${pathStr}`);

  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const headers = new Headers();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const tenantUuid = req.headers.get("x-tenant-uuid");
  if (tenantUuid) {
    headers.set("x-tenant-uuid", tenantUuid);
  }

  const contentType = req.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  const accept = req.headers.get("accept");
  if (accept) {
    headers.set("Accept", accept);
  }

  try {
    const res = await fetch(url.toString(), {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
      // @ts-expect-error Node fetch supports duplex for streaming request bodies
      duplex: "half",
    });

    const responseHeaders = new Headers(res.headers);
    for (const h of EXCLUDED_RESPONSE_HEADERS) {
      responseHeaders.delete(h);
    }

    return new NextResponse(res.body, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy request failed:", error);
    return NextResponse.json({ error: "Backend unavailable" }, { status: 502 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;

// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// const BASE_URL = process.env.VALIDATION_SERVICE_URL;

// const EXCLUDED_RESPONSE_HEADERS = [
//   "transfer-encoding",
//   "connection",
//   "keep-alive",
//   "proxy-authenticate",
//   "proxy-authorization",
//   "te",
//   "trailer",
//   "upgrade",
//   "content-length",
// ];

// async function handler(
//   req: NextRequest,
//   { params }: { params: Promise<{ path: string[] }> },
// ) {
//   if (!BASE_URL) {
//     return NextResponse.json(
//       { error: "Backend URL not configured" },
//       { status: 503 },
//     );
//   }

//   const cookieStore = await cookies();
//   const token = cookieStore.get("access_token")?.value;

//   if (!token) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { path } = await params;
//   const url = new URL(`${BASE_URL}/${path.join("/")}`);

//   req.nextUrl.searchParams.forEach((value, key) => {
//     url.searchParams.set(key, value);
//   });

//   const headers = new Headers();
//   headers.set("Authorization", `Bearer ${token}`);

//   const contentType = req.headers.get("content-type");
//   if (contentType) headers.set("Content-Type", contentType);

//   const accept = req.headers.get("accept");
//   if (accept) headers.set("Accept", accept);

//   try {
//     const res = await fetch(url.toString(), {
//       method: req.method,
//       headers,
//       body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
//       // @ts-expect-error Node fetch supports duplex for streaming request bodies
//       duplex: "half",
//     });

//     const responseHeaders = new Headers(res.headers);
//     for (const h of EXCLUDED_RESPONSE_HEADERS) {
//       responseHeaders.delete(h);
//     }

//     return new NextResponse(res.body, {
//       status: res.status,
//       headers: responseHeaders,
//     });
//   } catch {
//     return NextResponse.json({ error: "Backend unavailable" }, { status: 502 });
//   }
// }

// export const GET = handler;
// export const POST = handler;
// export const PUT = handler;
// export const PATCH = handler;
// export const DELETE = handler;

// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// // TODO: Log error if undefined
// const BASE_URL = process.env.VALIDATION_SERVICE_URL;

// export async function handler(
//   req: NextRequest,
//   { params }: { params: { path: string[] } },
// ) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("access_token")?.value;

//   if (!token) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { path } = await params;
//   const pathStr = path.join("/");
//   const url = new URL(`${BASE_URL}/${pathStr}`);

//   // Forward query params
//   req.nextUrl.searchParams.forEach((value, key) => {
//     url.searchParams.set(key, value);
//   });

//   const headers: Record<string, string> = {
//     Authorization: `Bearer ${token}`,
//   };

//   const contentType = req.headers.get("content-type");
//   if (contentType) {
//     headers["Content-Type"] = contentType;
//   }

//   // Only set Content-Type for non-FormData bodies
//   // const contentType = req.headers.get("content-type");
//   // if (contentType && !contentType.includes("multipart/form-data")) {
//   //   headers["Content-Type"] = contentType;
//   // }

//   const res = await fetch(url.toString(), {
//     method: req.method,
//     headers,
//     body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.blob(),
//   });

//   const data = await res.json().catch(() => null);
//   return NextResponse.json(data, { status: res.status });
// }

// export const GET = handler;
// export const POST = handler;
// export const PUT = handler;
// export const PATCH = handler;
// export const DELETE = handler;
