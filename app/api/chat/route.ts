import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const botResponses = [
  "Hello! How can I assist you?",
  "Tell me more about it!",
  "That sounds interesting!",
  "I’m just a bot, but I'm here to chat!",
  "Could you elaborate on that?",
];

export async function POST(req: Request) {
  try {
    const { userName, message } = await req.json();

    if (!userName || !message) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    let chat = await prisma.chat.findFirst({ where: { userName } });

    if (!chat) {
      chat = await prisma.chat.create({ data: { userName } });
    }

    await prisma.message.create({
      data: {
        chatId: chat.id,
        author: userName,
        content: message,
      },
    });

    const botMessage = botResponses[Math.floor(Math.random() * botResponses.length)];

    await prisma.message.create({
      data: {
        chatId: chat.id,
        author: "Bot",
        content: botMessage,
      },
    });

    return NextResponse.json({ botResponse: botMessage });
  } catch  {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userName = searchParams.get("userName");

  if (!userName) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  const chat = await prisma.chat.findFirst({
    where: { userName },
    include: { messages: true },
  });

  return NextResponse.json(chat ?? { error: "Chat not found" });
}
