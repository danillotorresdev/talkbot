import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Chat } from "@prisma/client";

export async function GET() {
  try {
    const users: Pick<Chat, "userName">[] = await prisma.chat.findMany({
      select: { userName: true },
      distinct: ["userName"],
    });

    return NextResponse.json(users.map((user) => user.userName));
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
