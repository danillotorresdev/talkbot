import { screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminPage from "@/app/admin/page";
import { server } from "@/__tests__/mockServer";
import {
  adminHandersWithoutMessages,
  adminUsersHandler,
  adminMessagesHandler,
  errorMessageByUser,
  adminUndefinedMessagesHandler,
} from "@/__tests__/handlers/adminHandlers";
import { customRender } from "@/utils/renderWithProviders";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    pathname: "/admin",
  }),
}));

describe("AdminPage - Integration tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    server.resetHandlers();
  });

  describe("Error Cases", () => {
    it("should show an error message when the API fails", async () => {
      server.use(adminUsersHandler, errorMessageByUser);
      customRender(<AdminPage />);

      await waitFor(() =>
        expect(screen.getByText(/Jhon/i)).toBeInTheDocument()
      );
      fireEvent.click(screen.getByText(/Jhon/i));

      expect(
        await screen.findByText("Failed to load messages")
      ).toBeInTheDocument();
    });

    it("should display empty state when no messages are returned", async () => {
      server.use(adminUsersHandler);
      customRender(<AdminPage />);

      await waitFor(() =>
        expect(screen.getByText(/Jhon/i)).toBeInTheDocument()
      );

      server.use(adminHandersWithoutMessages);
      fireEvent.click(screen.getByText(/Jhon/i));

      await waitFor(() => {
        expect(screen.getByText(/Empty/i)).toBeInTheDocument();
      });
    });

    it("should handle undefined messages", async () => {
      server.use(adminUsersHandler, adminUndefinedMessagesHandler);
      customRender(<AdminPage />);

      await waitFor(() =>
        expect(screen.getByText(/Jhon/i)).toBeInTheDocument()
      );
      fireEvent.click(screen.getByText(/Jhon/i));

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to load messages/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Success Cases", () => {
    it("should display users in the sidebar", async () => {
      server.use(adminUsersHandler, adminMessagesHandler);
      customRender(<AdminPage />);

      await waitFor(() => {
        expect(screen.getByText(/Jhon/i)).toBeInTheDocument();
        expect(screen.getByText(/Alice/i)).toBeInTheDocument();
        expect(screen.getByText(/Bob/i)).toBeInTheDocument();
      });
    });

    it("should display messages when a user is selected", async () => {
      server.use(adminUsersHandler, adminMessagesHandler);
      customRender(<AdminPage />);

      await waitFor(() =>
        expect(screen.getByText(/Jhon/i)).toBeInTheDocument()
      );
      fireEvent.click(screen.getByText(/Jhon/i));

      await waitFor(() => {
        expect(screen.getByText("Hello!")).toBeInTheDocument();
        expect(screen.getByText("Hi Jhon!")).toBeInTheDocument();
      });
    });
  });

  describe("Navigation", () => {
    it("should navigate to the chat page when 'Go to Chat' is clicked", async () => {
      server.use(adminUsersHandler, adminMessagesHandler);
      customRender(<AdminPage />);

      fireEvent.click(screen.getByText("Go to Chat"));

      expect(mockPush).toHaveBeenCalledWith("/chat");
    });
  });
});
