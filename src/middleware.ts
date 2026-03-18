import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 },
    );
  }
}

export const config = {
  matcher: "/api/users/profile/:path*",
};
