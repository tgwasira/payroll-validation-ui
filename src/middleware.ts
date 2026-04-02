// @ts-nocheck
import { createRemoteJWKSet, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { getMaxAgeFromToken } from "@/app/auth_utils";
import { PERMISSION_ROUTES, PUBLIC_ROUTES } from "@/constants/routeProtection";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
const PROJECT_JWKS = createRemoteJWKSet(
  new URL(`${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`),
);

interface UserPayload {
  roles?: string[];
  [key: string]: unknown;
}

// TODO: Consider using Supabase client
async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, PROJECT_JWKS);
    return payload as UserPayload;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}

function getLocaleFromPathname(pathname: string): string {
  const localeMatch = pathname.match(/^\/([a-z]{2})(?=\/|$)/);
  return localeMatch?.[1] ?? "en";
}

function getPathnameWithoutLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");
  return stripped || "/";
}

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const locale = getLocaleFromPathname(pathname);
  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname);

  const isLoginRoute = pathnameWithoutLocale === "/login";
  const isPublicRoute =
    !isLoginRoute &&
    PUBLIC_ROUTES.some(
      (route) =>
        pathnameWithoutLocale === route ||
        pathnameWithoutLocale.startsWith(`${route}/`),
    );

  const token = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  let user = token ? await verifyToken(token) : null;
  let refreshedResponse: NextResponse | null = null;

  // If access token is invalid or missing, try refreshing
  if (!user && refreshToken) {
    try {
      const res = await fetch(`${process.env.API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (res.ok) {
        const { accessToken } = await res.json();
        const refreshedUser = await verifyToken(accessToken);

        if (refreshedUser) {
          user = refreshedUser;

          const maxAge = (() => {
            try {
              return getMaxAgeFromToken(accessToken);
            } catch {
              return 60 * 60 * 24;
            }
          })();

          refreshedResponse = intlMiddleware(req) as NextResponse;
          refreshedResponse.cookies.set("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge,
          });
        }
      }
    } catch (err) {
      console.error("Refresh failed:", err);
    }
  }

  // Special handling for login:
  // - authenticated users should be redirected away
  // - unauthenticated users may access it
  if (isLoginRoute) {
    if (user) {
      return NextResponse.redirect(
        new URL(`/${locale}/validation-jobs`, req.url),
      );
    }

    return refreshedResponse ?? intlMiddleware(req);
  }

  // Allow other public routes through
  if (isPublicRoute) {
    return refreshedResponse ?? intlMiddleware(req);
  }

  // All remaining routes are protected
  if (!user) {
    const redirectResponse = NextResponse.redirect(
      new URL(`/${locale}/login`, req.url),
    );

    redirectResponse.cookies.delete("access_token");
    redirectResponse.cookies.delete("refresh_token");

    return redirectResponse;
  }

  // Role-based protection
  const matchedRoute = Object.keys(PERMISSION_ROUTES).find(
    (route) =>
      pathnameWithoutLocale === route ||
      pathnameWithoutLocale.startsWith(`${route}/`),
  );

  if (matchedRoute) {
    const allowedRoles = PERMISSION_ROUTES[matchedRoute];
    const userRoles = user.roles ?? [];
    const hasPermission = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasPermission) {
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
    }
  }

  return refreshedResponse ?? intlMiddleware(req);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

// // import { verifyToken } from "@algion-co/react-ui-library";
// import { jwtVerify } from "jose";
// import { NextResponse } from "next/server";
// import createMiddleware from "next-intl/middleware";

// import { PERMISSION_ROUTES, PUBLIC_ROUTES } from "@/constants/routeProtection";

// import { routing } from "./i18n/routing";
// const intlMiddleware = createMiddleware(routing);

// const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);

// export async function verifyToken(token: string) {
//   try {
//     const { payload } = await jwtVerify(token, secret);
//     return payload;
//   } catch (err) {
//     console.error("Token verification failed: ", err);
//     return null;
//   }
// }

// export default async function middleware(req) {
//   const response = intlMiddleware(req);

//   const token = req.cookies.get("access_token")?.value;

//   const pathname = req.nextUrl.pathname;
//   const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");

//   const locale = pathname.split("/")[1] || "en"; // TODO: Verify

//   const isPublicRoute = PUBLIC_ROUTES.some((route) =>
//     pathnameWithoutLocale.startsWith(route),
//   );

//   // Redirect logged-in users away from login
//   // TODO: Not good if not user.
//   if (token && pathnameWithoutLocale === "/login") {
//     return NextResponse.redirect(
//       new URL(`/${locale}/validation-jobs`, req.url),
//     );
//   }

//   // Allow public routes
//   if (isPublicRoute) {
//     return response;
//   }

//   // Require login
//   if (!token) {
//     return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
//   }

//   const user = await verifyToken(token);

//   // if (!user) {
//   //   return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
//   // }

//   if (!user) {
//     const refreshToken = req.cookies.get("refresh_token")?.value;

//     if (refreshToken) {
//       try {
//         const res = await fetch(`${process.env.API_URL}/auth/refresh`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ refreshToken }),
//         });

//         if (res.ok) {
//           const { accessToken } = await res.json();

//           const newUser = await verifyToken(accessToken);

//           if (newUser) {
//             const response = intlMiddleware(req);

//             response.cookies.set("access_token", accessToken, {
//               httpOnly: true,
//               secure: process.env.NODE_ENV === "production",
//               sameSite: "lax",
//               path: "/",
//             });

//             return response;
//           }
//         }
//       } catch (err) {
//         console.error("Refresh failed:", err);
//       }
//     }

//     // Clear cookies when auth fails
//     const response = NextResponse.redirect(
//       new URL(`/${locale}/login`, req.url),
//     );

//     response.cookies.delete("access_token");
//     response.cookies.delete("refresh_token");

//     return response;
//   }

//   const matchedRoute = Object.keys(PERMISSION_ROUTES).find((route) =>
//     pathnameWithoutLocale.startsWith(route),
//   );

//   if (matchedRoute) {
//     const allowedRoles = PERMISSION_ROUTES[matchedRoute];
//     const userRoles = user.roles || [];

//     const hasPermission = allowedRoles.some((role) => userRoles.includes(role));

//     if (!hasPermission) {
//       return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
//     }
//   }

//   return response;
// }

// export const config = {
//   matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
// };
