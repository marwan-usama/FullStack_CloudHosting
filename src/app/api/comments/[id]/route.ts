import { prisma } from "@/lib/prisma";
import { getAuthorizedUser } from "@/utils/auth";
import { UpdateCommentDto } from "@/utils/dtos";
import { NextRequest, NextResponse } from "next/server";

/**
 *  @method  PUT
 *  @route   ~/api/comments/:id
 *  @desc    Update Comment
 *  @access  private (only owner of the comment)
 */

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const id = Number((await params).id);
    const comment = await prisma.comment.findUnique({
      where: {
        id,
      },
    });
    if (!comment) {
      return NextResponse.json(
        {
          message: "comment not found",
        },
        {
          status: 404,
        },
      );
    }
    const auth = await getAuthorizedUser();
    if (auth.error) {
      return auth.error;
    }

    if (comment.userId !== auth.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as UpdateCommentDto;
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { text: body.text },
    });

    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 },
    );
  }
}

/**
 *  @method  DELETE
 *  @route   ~/api/comments/:id
 *  @desc    Delete Comment
 *  @access  private (only admin OR owner of the comment)
 */

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const id = Number((await params).id);
    const comment = await prisma.comment.findUnique({
      where: { id },
    });
    if (!comment) {
      return NextResponse.json(
        { message: "comment not found" },
        { status: 404 },
      );
    }

    const auth = await getAuthorizedUser();
    if (auth.error) {
      return auth.error;
    }

    if (auth.isAdmin || auth.userId === comment.userId) {
      await prisma.comment.delete({ where: { id } });
      return NextResponse.json({ message: "comment deleted" }, { status: 200 });
    }

    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 },
    );
  }
}
