import { screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChatPage from "@/app/chat/page";
import { server } from "@/__tests__/mockServer";
import {
  chatMessagesHandler,
  chatMessagesErrorHandler,
  chatEmptyMessagesHandler,
  chatSendMessageHandler,
  chatSendMessageErrorHandler,
} from "@/__tests__/handlers/chatHandlers";
import { customRender } from "@/utils/renderWithProviders";
import { Message } from "@prisma/client";

const mockPush = vi.fn();
const mockPathname = vi.fn(() => "/chat");

vi.mock("next/navigation", async () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    pathname: "/chat",
  }),
  usePathname: () => mockPathname(),
}));

vi.stubGlobal("localStorage", {
  getItem: vi.fn(() => "Jhon"),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
});

describe("ChatPage - Integration Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    server.resetHandlers();
  });

  describe("Error cases", () => {
    it("should show an error message when the API fails", async () => {
      server.use(chatMessagesErrorHandler);
      customRender(<ChatPage />);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          "Failed to fetch chat messages"
        );
      });
    });

    it("should display empty state when no messages are returned", async () => {
      server.use(chatEmptyMessagesHandler);
      customRender(<ChatPage />);

      await waitFor(() => {
        expect(screen.getByText(/Empty/i)).toBeInTheDocument();
      });
    });

    it("should show an error when sending a message fails", async () => {
      server.use(chatMessagesHandler, chatSendMessageErrorHandler);

      // Get the query client instance from customRender
      const { queryClient } = customRender(<ChatPage />);

      const input = screen.getByPlaceholderText("Type a message...");
      const sendButton = screen.getByText("Send");

      fireEvent.change(input, { target: { value: "This will fail" } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          "Failed to send message"
        );
      });

      // Now `queryClient` should contain previous messages
      const previousMessages = queryClient.getQueryData<{
        messages: Message[];
      }>(["chatMessages", "Jhon"]);

      expect(previousMessages?.messages.length).toBeGreaterThan(0);
    });
  });

  describe("Sidebar", () => {
    it("should open the chat when a contact is selected", async () => {
      server.use(chatMessagesHandler);
      customRender(<ChatPage />);

      const contactButton = await screen.findByText("Chat Bot");
      fireEvent.click(contactButton);

      await waitFor(() => {
        expect(screen.getByText("Hi Jhon!")).toBeInTheDocument();
      });
    });
  });

  describe("Success Cases", () => {
    it("should display messages when chat loads", async () => {
      server.use(chatMessagesHandler);
      customRender(<ChatPage />);

      expect(await screen.findByText("Hello!")).toBeInTheDocument();
      expect(await screen.findByText("Hi Jhon!")).toBeInTheDocument();
    });

    it("should send a message successfully", async () => {
      server.use(chatSendMessageHandler);
      vi.stubGlobal(
        "fetch",
        vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
          })
        )
      );

      customRender(<ChatPage />);

      const input = screen.getByPlaceholderText("Type a message...");
      const sendButton = screen.getByText("Send");

      fireEvent.change(input, { target: { value: "How are you?" } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          "/api/chat",
          expect.objectContaining({
            method: "POST",
            body: JSON.stringify({ userName: "Jhon", message: "How are you?" }),
          })
        );
      });

      vi.restoreAllMocks();
    });

    it("should close the chat and show the sidebar when 'Back' is clicked", async () => {
      server.use(chatMessagesHandler);
      customRender(<ChatPage />);

      const backButton = await screen.findByText("← Back");
      fireEvent.click(backButton);

      await waitFor(() => {
        expect(screen.getByText("Chat Bot")).toBeInTheDocument();
      });
    });
  });

  describe("Navigation", () => {
    it("should navigate to the admin page when 'Admin Panel' is clicked", async () => {
      server.use(chatMessagesHandler);
      customRender(<ChatPage />);

      const adminButton = await screen.findByText("Admin Panel");
      fireEvent.click(adminButton);

      expect(mockPush).toHaveBeenCalledWith("/admin");
    });
  });

  describe("Authentication", () => {
    it("should logout user and redirect to home", async () => {
      server.use(chatMessagesHandler);
      customRender(<ChatPage />);

      const logoutButton = await screen.findByText("Logout");
      fireEvent.click(logoutButton);

      expect(localStorage.removeItem).toHaveBeenCalledWith("chatUserName");
      expect(mockPush).toHaveBeenCalledWith("/");
    });

    it("should redirect to home if no user is logged in", async () => {
      vi.stubGlobal("localStorage", {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      });

      customRender(<ChatPage />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/");
      });
    });
  });
});
