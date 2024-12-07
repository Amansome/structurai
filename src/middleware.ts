import { auth } from "./server/auth";

export default auth((req) => {
  const isAuthenticated = !!req.auth;

  if (!isAuthenticated) {
    const newUrl = new URL("/signin", req.nextUrl.origin);
    return Response.redirect(newUrl.toString(), 302); 
  }
});

export const config = {
    matcher: ["/dashboard/:path*"],
}