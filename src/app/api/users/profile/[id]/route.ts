import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const id = Number((await params).id);

    const profileToDelete = await prisma.user.findUnique({
      where: { id },
    });
    if (!profileToDelete) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const authHeader = request.headers.get("Authorization") as string;
    const token = authHeader?.split(" ")[1];
    const decodedToken = verifyJwt(token);
    if (!decodedToken) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 },
      );
    }
    if (profileToDelete?.id !== decodedToken.id) {
      return NextResponse.json(
        { message: "You do not have permission to delete this user" },
        { status: 403 },
      );
    }
    await prisma.user.delete({
      where: { id: id },
    });
    return NextResponse.json(
      { message: "user deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        message: "internal server error",
        error: errorMessage,
      },
      {
        status: 500,
      },
    );
  }
}
