import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

// Criando um mock para useRouter
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    pathname: "/admin",
  }),
}));

describe("AdminPage - Error use case", () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("should show an error message when the API fails", async () => {
    server.use(adminUsersHandler, errorMessageByUser);

    render(
      <QueryClientProvider client={queryClient}>
        <AdminPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Jhon/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Jhon/i));

    expect(
      await screen.findByText("Failed to load messages")
    ).toBeInTheDocument();
  });

  it("should pass an empty array to ChatWindow when messages is empty", async () => {
    server.use(adminUsersHandler);
    render(
      <QueryClientProvider client={queryClient}>
        <AdminPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Jhon/i)).toBeInTheDocument();
    });

    server.use(adminHandersWithoutMessages);

    fireEvent.click(screen.getByText(/Jhon/i));

    await waitFor(() => {
      expect(screen.getByText(/Empty/i)).toBeInTheDocument();
    });
  });

  it("should pass an empty array to ChatWindow when messages is undefined", async () => {
    server.use(adminUsersHandler);
    server.use(adminUndefinedMessagesHandler);
    render(
      <QueryClientProvider client={queryClient}>
        <AdminPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Jhon/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Jhon/i));

    await waitFor(() => {
      expect(screen.getByText(/Failed to load messages/i)).toBeInTheDocument();
    });
  });
});

describe("AdminPage - success use case", () => {
  const queryClient = new QueryClient();
  it("should display users in the sidebar", async () => {
    server.use(adminUsersHandler, adminMessagesHandler);
    render(
      <QueryClientProvider client={queryClient}>
        <AdminPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Jhon/i)).toBeInTheDocument();
      expect(screen.getByText(/Alice/i)).toBeInTheDocument();
      expect(screen.getByText(/Bob/i)).toBeInTheDocument();
    });
  });

  it("should display messages when a user is selected", async () => {
    server.use(adminUsersHandler, adminMessagesHandler);
    const { debug } = render(
      <QueryClientProvider client={queryClient}>
        <AdminPage />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText(/Jhon/i)).toBeInTheDocument());
    debug();
    fireEvent.click(screen.getByText(/Jhon/i));

    await waitFor(() => {
      expect(screen.getByText("Hello!")).toBeInTheDocument();
      expect(screen.getByText("Hi Jhon!")).toBeInTheDocument();
    });
  });

  it("should navigate to the chat page when 'Go to Chat' is clicked", async () => {
    server.use(adminUsersHandler, adminMessagesHandler);
    render(
      <QueryClientProvider client={queryClient}>
        <AdminPage />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText("Go to Chat"));

    expect(mockPush).toHaveBeenCalledWith("/chat");
  });
});
