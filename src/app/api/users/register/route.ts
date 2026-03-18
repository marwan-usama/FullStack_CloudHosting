import { prisma } from "@/lib/prisma";
import { CreateUserDto } from "@/utils/dtos";
import { CreateUserSchema } from "@/utils/validationSchemas";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import z from "zod";
import { Prisma } from "@/generated/prisma/client";
import { generateJwtToken } from "@/utils/jwt";

export async function POST(request: NextRequest) {
  const saltRounds = 10;
  try {
    const json = (await request.json()) as CreateUserDto;
    const { email, password, username } =
      await CreateUserSchema.parseAsync(json);

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const createdUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        isAdmin: true,
      },
    });
    const secretKey = process.env.JWT_SECRET as string;
    const token = generateJwtToken(
      {
        id: createdUser.id,
        isAdmin: createdUser.isAdmin,
      },
      secretKey,
      "1h",
    );

    return NextResponse.json(
      {
        ...createdUser,
        token,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { message: "email already exists" },
          { status: 409 },
        );
      }
    }
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
