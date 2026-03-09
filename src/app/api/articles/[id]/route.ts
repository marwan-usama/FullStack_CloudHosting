// import { articles } from "@/utils/data";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: number }> },
// ) {
//   const id = Number((await params).id);
//   const article = articles.find((a) => a.id === id);

//   if (!article) {
//     return NextResponse.json(
//       {
//         message: "article not found",
//       },
//       {
//         status: 404,
//       },
//     );
//   }
//   return NextResponse.json(
//     {
//       message: "article updated succefuly",
//     },
//     {
//       status: 200,
//     },
//   );
// }
