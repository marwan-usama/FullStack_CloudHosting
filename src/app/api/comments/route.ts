import { prisma } from "@/lib/prisma";
import { getAuthorizedUser } from "@/utils/auth";
import { CreateCommentDto } from "@/utils/dtos";
import { CreateCommentSchema } from "@/utils/validationSchemas";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

/**
 *  @method  POST
 *  @route   ~/api/comments
 *  @desc    Create New Comment
 *  @access  private (only logged in user)
 */

export async function POST(request: NextRequest) {
  try {
    const json = (await request.json()) as CreateCommentDto;
    const body = await CreateCommentSchema.parseAsync(json);
    const { error, userId } = await getAuthorizedUser();
    if (error) {
      return error;
    }
    const article = await prisma.article.findUnique({
      where: {
        id: Number(body.articleId),
      },
    });
    if (!article) {
      return NextResponse.json(
        {
          message: "article not found",
        },
        {
          status: 404,
        },
      );
    }
    const comment = await prisma.comment.create({
      data: {
        text: body.text,
        articleId: Number(body.articleId),
        userId,
      },
    });
    return NextResponse.json(
      {
        message: "Comment created successfully",
        comment,
      },
      {
        status: 201,
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

/**
 *  @method  GET
 *  @route   ~/api/comments
 *  @desc    Get All Comments
 *  @access  private (only admin)
 */

export async function GET() {
  try {
    const auth = await getAuthorizedUser();
    if (auth.error) {
      return auth.error;
    }
    if (!auth.isAdmin) {
      return NextResponse.json(
        { message: "only admin, access denied" },
        { status: 403 },
      );
    }
    const comments = await prisma.comment.findMany();
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 },
    );
  }
}
