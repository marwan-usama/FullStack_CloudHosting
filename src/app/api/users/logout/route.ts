import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    (await cookies()).delete("jwtToken");
    return NextResponse.json(
      {
        message: "Logout successful",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Logout failed",
      },
      { status: 500 },
    );
  }
}
