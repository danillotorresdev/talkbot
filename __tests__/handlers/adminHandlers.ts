import { http, HttpResponse } from "msw";

export const adminUsersHandler = http.get("/api/admin/users", async () => {
  return HttpResponse.json(["Jhon", "Alice", "Bob"]);
});

export const adminMessagesHandler = http.get(
  "/api/admin/messages",
  async ({ request }) => {
    const url = new URL(request.url);
    const userName = url.searchParams.get("userName");

    if (userName === "Jhon") {
      return HttpResponse.json([
        {
          id: "1",
          author: "Jhon",
          content: "Hello!",
          timestamp: new Date().toISOString(),
        },
        {
          id: "2",
          author: "Bot",
          content: "Hi Jhon!",
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    return HttpResponse.json([]);
  }
);

export const errorMessageByUser = http.get("/api/admin/messages", () => {
  throw new HttpResponse(null, { status: 500 });
});

export const adminHandersWithoutMessages = http.get(
  "/api/admin/messages",
  async () => {
    return HttpResponse.json([]);
  }
);

export const adminUndefinedMessagesHandler = http.get(
  "/api/admin/messages",
  async ({ request }) => {
    const url = new URL(request.url);
    const userName = url.searchParams.get("userName");

    if (userName === "Jhon") {
      return HttpResponse.json(undefined);
    }

    return HttpResponse.json([]);
  }
);

export const adminUsersErrorHandler = http.get(
  "/api/admin/users",
  async () => {
    return HttpResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
);
