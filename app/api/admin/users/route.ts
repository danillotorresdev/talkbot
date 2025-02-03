import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.chat.findMany({
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
