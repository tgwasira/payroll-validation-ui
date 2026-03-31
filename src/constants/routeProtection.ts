export const PUBLIC_ROUTES = [
  "/signup",
  "/forgot-password",
  "/complete-signup",
]; // Routes that can be accessed without authentication
export const PUBLIC_PROXY_ROUTES = ["auth/signup", "auth/login"]; // API calls in proxy that can be made without access token cookie
export const PERMISSION_ROUTES = {
  "/admin": ["admin"],
  "/dashboard/users": ["admin", "manager"],
};
