import { CreateArticleDto } from "@/utils/dtos";
import { CreateArticleSchema } from "@/utils/validationSchemas";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { Article } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  const articles = await prisma.article.findMany({
    include: {
      comments: true,
    },
  });
  return NextResponse.json({
    articles,
  });
}
export async function POST(request: NextRequest) {
  try {
    const json = (await request.json()) as CreateArticleDto;

    const body = await CreateArticleSchema.parseAsync(json);

    const newArticle: Article = await prisma.article.create({
      data: {
        description: body.description,
        title: body.title,
      },
    });

    return NextResponse.json(
      {
        message: "Article created successfully",
        article: newArticle,
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
