import { http, HttpResponse } from "msw";

export const chatMessagesHandler = http.get(
  "/api/chat",
  async ({ request }) => {
    const url = new URL(request.url);
    const userName = url.searchParams.get("userName");

    if (!userName) {
      return HttpResponse.json({ error: "Missing userName" }, { status: 400 });
    }

    if (userName === "Jhon") {
      const response = {
        messages: [
          {
            id: "1",
            chatId: "chat-1",
            author: "Jhon",
            content: "Hello!",
            timestamp: new Date().toISOString(),
          },
          {
            id: "2",
            chatId: "chat-1",
            author: "Bot",
            content: "Hi Jhon!",
            timestamp: new Date().toISOString(),
          },
        ],
      };

      return HttpResponse.json(response);
    }

    return HttpResponse.json({ messages: [] });
  }
);

export const chatMessagesErrorHandler = http.get("/api/chat", async () => {
  throw new HttpResponse(null, { status: 500 });
});

export const chatEmptyMessagesHandler = http.get("/api/chat", async () => {
  return HttpResponse.json({ messages: [] });
});

export const chatUndefinedMessagesHandler = http.get(
  "/api/chat",
  async ({ request }) => {
    const url = new URL(request.url);
    const userName = url.searchParams.get("userName");

    if (!userName) {
      return HttpResponse.json({ error: "Missing userName" }, { status: 400 });
    }

    if (userName === "Jhon") {
      return HttpResponse.json({ messages: undefined });
    }

    return HttpResponse.json({ messages: [] });
  }
);

export const chatSendMessageHandler = http.post(
  "/api/chat",
  async ({ request }) => {
    const { message, userName } = (await request.json()) as {
      userName?: string;
      message?: string;
    };

    if (!userName || !message?.trim()) {
      return HttpResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 201 });
  }
);

export const chatSendMessageErrorHandler = http.post("/api/chat", async () => {
  return HttpResponse.json(
    { error: "Failed to send message" },
    { status: 500 }
  );
});
