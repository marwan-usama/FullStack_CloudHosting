import { prisma } from "@/lib/prisma";
import { RecieveUserDto } from "@/utils/dtos";
import { LoginUserSchema } from "@/utils/validationSchemas";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { generateJwtToken } from "@/utils/jwt";
import z from "zod";
import { TokenPayload } from "@/utils/types";
import { cookies } from "next/headers";
import { setAuthCookies } from "@/utils/auth";
export async function POST(request: NextRequest) {
  /**
   * 1- take the body from user
   * 2- validate the body, make sure that body contains eamil,password
   * 3- find the user by his email
   * 4- decode the hashed password and compare it
   * 5- send token
   */

  try {
    const json = (await request.json()) as RecieveUserDto;
    const { email, password } = await LoginUserSchema.parseAsync(json);
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return NextResponse.json(
        {
          message: "invalid email or password",
        },
        { status: 401 },
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        {
          message: "invalid email or password",
        },
        { status: 401 },
      );
    }
    const payload: TokenPayload = {
      id: user.id,
      isAdmin: user.isAdmin,
    };
    const secretKey = process.env.JWT_SECRET as string;

    const token = generateJwtToken(payload, secretKey, "1h");
    await setAuthCookies("jwtToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json(
      {
        message: "Login successful",
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
        message: "Invalid request",
        error: errorMessage,
      },
      { status: 400 },
    );
  }
}
