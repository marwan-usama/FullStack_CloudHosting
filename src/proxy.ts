import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwtToken")?.value as string;
  if (!token) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 },
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/api/users/profile/:path*",
};
