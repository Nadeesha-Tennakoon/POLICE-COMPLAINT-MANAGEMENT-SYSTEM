import { NextResponse } from "next/server";
import getAuthUser from "./lib/getAuthUser";

//Define role-based protected routes
const roleBasedRoutes = {
  admin: ["/dashboard/admin", "/complaint/view"],
  user: ["/dashboard/user", "/complaint/add"],
};

//Routes accessible by **both** Admin & User
const sharedRoutes = ["/complaint/show"];

const publicRoutes = ["/login", "/register"];

export default async function middleware(req) {
  const { pathname } = req.nextUrl;
  const isPublic = publicRoutes.includes(pathname);

  try {
    const user = await getAuthUser(req);
    const userId = user?.userId;
    const role = user?.role; // Expecting 'admin' or 'user'

    // Redirect **unauthenticated** users
    if (!userId && !isPublic) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    //Redirect authenticated users away from login/register pages
    if (isPublic && userId) {
      return NextResponse.redirect(new URL(`/dashboard/${user.role}`, req.url));
    }

    //Allow access if the route starts with any shared route
    const isSharedRoute = sharedRoutes.some((route) =>
      pathname.startsWith(route)
    );
    if (isSharedRoute) {
      return NextResponse.next();
    }

    //Role-based restriction for exclusive routes
    const isAdminRoute = roleBasedRoutes.admin.some((route) =>
      pathname.startsWith(route)
    );
    const isUserRoute = roleBasedRoutes.user.some((route) =>
      pathname.startsWith(route)
    );

    if (role === "admin" && !isAdminRoute) {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }
    if (role === "user" && !isUserRoute) {
      return NextResponse.redirect(new URL("/dashboard/user", req.url));
    }
  } catch (error) {
    console.error("Middleware Error:", error);
    return NextResponse.next();
  }

  return NextResponse.next();
}

//Middleware Matcher - Apply only to relevant routes
export const config = {
  matcher: ["/dashboard/:path*", "/complaint/:path*", "/login", "/register"],
};
