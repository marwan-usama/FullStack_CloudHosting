import { User } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getAuthorizedUser } from "@/utils/auth";
import { UpdateUserDto } from "@/utils/dtos";
import { UpdateUserSchema } from "@/utils/validationSchemas";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import z from "zod";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const id = Number((await params).id);
    const auth = await getAuthorizedUser(id);
    if (auth.error) {
      return auth.error;
    }
    const profileToDelete = await prisma.user.findUnique({
      where: { id },
    });
    if (!profileToDelete) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const id = Number((await params).id);
    const auth = await getAuthorizedUser(id);
    if (auth.error) {
      return auth.error;
    }
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const id = Number((await params).id);
    const auth = await getAuthorizedUser(id);
    if (auth.error) {
      return auth.error;
    }

    const json = (await request.json()) as UpdateUserDto;

    const body = await UpdateUserSchema.parseAsync(json);

    if (body.password) {
      const saltRounds = 10;
      body.password = await bcrypt.hash(body.password, saltRounds);
    }

    const updatedUser: User = await prisma.user.update({
      where: {
        id,
      },
      data: {
        username: body.username,
        password: body.password,
        email: body.email,
      },
    });
    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const { password, ...other } = updatedUser; // i can make it through select property at prisma  
    return NextResponse.json(
      {
        message: "user updated successfully",
        updatedUser:{...other}
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Validation error",
          error: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        message: "Invalid JSON format",
        error: errorMessage,
      },
      { status: 400 },
    );
  }
}
