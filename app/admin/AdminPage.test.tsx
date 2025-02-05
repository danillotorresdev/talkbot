import { screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminPage from "@/app/admin/page";
import { server } from "@/__tests__/mockServer";
import {
  adminUsersHandler,
  adminMessagesHandler,
  adminHandersWithoutMessages,
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

describe("AdminPage - Integration Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    server.resetHandlers();
  });

  describe("Error Cases", () => {
    it("should show an error message when the API fails", async () => {
      server.use(adminUsersHandler, errorMessageByUser);
      customRender(<AdminPage />);

      const select = await screen.findByLabelText("User List");
      fireEvent.change(select, { target: { value: "Jhon" } });

      expect(
        await screen.findByText(/Failed to load messages/i)
      ).toBeInTheDocument();
    });

    it("should display empty state when no messages are returned", async () => {
      server.use(adminUsersHandler);
      customRender(<AdminPage />);

      const select = await screen.findByLabelText("User List");
      server.use(adminHandersWithoutMessages);
      fireEvent.change(select, { target: { value: "Jhon" } });

      await waitFor(() => {
        expect(screen.getByText(/Empty/i)).toBeInTheDocument();
      });
    });

    it("should handle undefined messages", async () => {
      server.use(adminUsersHandler, adminUndefinedMessagesHandler);
      customRender(<AdminPage />);

      const select = await screen.findByLabelText("User List");
      fireEvent.change(select, { target: { value: "Jhon" } });

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
        expect(screen.getByLabelText("User List")).toBeInTheDocument();
      });
    });
  });

  describe("Navigation", () => {
    it("should navigate to '/chat' when 'Go to Chat' is clicked", async () => {
      server.use(adminUsersHandler, adminMessagesHandler);
      customRender(<AdminPage />);

      fireEvent.click(screen.getByText("Go to Chat"));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/chat");
      });
    });
  });
});
