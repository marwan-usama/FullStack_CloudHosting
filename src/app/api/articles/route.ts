import { CreateArticleDto } from "@/utils/dtos";
import { CreateArticleSchema } from "@/utils/validationSchemas";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { Article } from "@/generated/prisma/client";
import { ARTICLE_PER_PAGE } from "@/utils/constants";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;

    const skip = (page - 1) * ARTICLE_PER_PAGE;
    const articles = await prisma.article.findMany({
      include: {
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                username: true,
                id: true,
              },
            },
          },
        },
      },
      take: ARTICLE_PER_PAGE,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    });
    const totalArticles = await prisma.article.count();
    const totalPages = Math.ceil(totalArticles / ARTICLE_PER_PAGE);
    return NextResponse.json({
      articles,
      totalPages,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 },
    );
  }
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
