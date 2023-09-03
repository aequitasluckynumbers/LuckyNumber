import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req) {
  // console.log(req);
  const token = req.cookies.get("authorization");
  const { pathname } = req.nextUrl;

  if (pathname == "/login") {
    return NextResponse.next();
  }

  try {
    var key = process.env.JWT_SEC;
    const sec = new TextEncoder().encode(key);

    const user = await jwtVerify(token.value, sec);

    if (user.payload.app_metadata.provider == "email") {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icons|images|favicon.ico).*)"],
};
