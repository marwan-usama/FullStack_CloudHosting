import { cookies } from "next/headers";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { verifyJwt } from "./jwt";
import { NextResponse } from "next/server";

export async function setAuthCookies(
  name: string,
  token: string,
  options: Partial<ResponseCookie> = {},
) {
  const cookieStore = await cookies();
  cookieStore.set(name, token, options);
}

export async function getAuthorizedUser(requestedUserId: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwtToken")?.value;

  if (!token) {
    return {
      error: NextResponse.json(
        { message: "No token provided" },
        { status: 401 },
      ),
    };
  }

  const decodedToken = verifyJwt(token);

  if (!decodedToken) {
    return {
      error: NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 },
      ),
    };
  }

  if (decodedToken.id !== requestedUserId) {
    return {
      error: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
    };
  }

  return { userId: decodedToken.id };
}
