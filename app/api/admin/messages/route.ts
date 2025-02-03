import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userName = searchParams.get("userName");

  if (!userName) {
    return NextResponse.json({ error: "Missing userName" }, { status: 400 });
  }

  try {
    const chat = await prisma.chat.findFirst({
      where: { userName },
      include: { messages: true },
    });

    return NextResponse.json(chat?.messages || []);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
