// import { articles } from "@/utils/data";
import { prisma } from "@/lib/prisma";
import { UpdateArticleDto } from "@/utils/dtos";
import { UpdateArticleSchema } from "@/utils/validationSchemas";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const id = Number((await params).id);
    const article = await prisma.article.findUnique({
      where: {
        id: id,
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
    return NextResponse.json(
      {
        article,
      },
      {
        status: 200,
      },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const id = Number((await params).id);
    const json = (await request.json()) as UpdateArticleDto;
    const body = await UpdateArticleSchema.parseAsync(json);
    const article = await prisma.article.update({
      where: {
        id,
      },
      data: body,
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
    return NextResponse.json(
      {
        message: "article updated successfully",
        article,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const id = Number((await params).id);
    const deletedArticle = await prisma.article.delete({
      where: {
        id,
      },
    });
    if (!deletedArticle) {
      return NextResponse.json(
        {
          message: "Article not found",
        },
        {
          status: 404,
        },
      );
    }
    return NextResponse.json(
      {
        message: "Article Deleted successfully",
        article: deletedArticle,
      },
      {
        status: 200,
      },
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
