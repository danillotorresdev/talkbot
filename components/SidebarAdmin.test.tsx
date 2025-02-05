import { screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SidebarAdmin from "@/components/SidebarAdmin";
import { server } from "@/__tests__/mockServer";
import {
  adminUsersHandler,
  adminUsersErrorHandler,
} from "@/__tests__/handlers/adminHandlers";
import { customRender } from "@/utils/renderWithProviders";

vi.mock("@/components/LogoutButton", () => ({
  default: vi.fn(() => <button>Logout</button>),
}));

describe("SidebarAdmin Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    server.resetHandlers();
  });

  it("should display users fetched from the API", async () => {
    server.use(adminUsersHandler);

    customRender(<SidebarAdmin onSelectUser={vi.fn()} selectedUser={null} />);

    await waitFor(() => {
      expect(screen.getByText("Jhon")).toBeInTheDocument();
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });

  it("should display 'No users found' when API fails", async () => {
    server.use(adminUsersErrorHandler);

    customRender(<SidebarAdmin onSelectUser={vi.fn()} selectedUser={null} />);

    await waitFor(() => {
      expect(screen.getByText(/No users found/i)).toBeInTheDocument();
    });
  });

  it("should call onSelectUser when a user is clicked", async () => {
    server.use(adminUsersHandler);

    const mockSelectUser = vi.fn();
    customRender(
      <SidebarAdmin onSelectUser={mockSelectUser} selectedUser={null} />
    );

    const userButton = await screen.findByText("Jhon");
    fireEvent.click(userButton);

    expect(mockSelectUser).toHaveBeenCalledWith("Jhon");
  });

  it("should highlight the selected user", async () => {
    server.use(adminUsersHandler);

    customRender(<SidebarAdmin onSelectUser={vi.fn()} selectedUser="Alice" />);

    await waitFor(() => {
      const selectedUser = screen.getByText("Alice");
      expect(selectedUser).toHaveClass("bg-gray-700");
    });
  });

  it("should render the LogoutButton", () => {
    server.use(adminUsersHandler);
    customRender(<SidebarAdmin onSelectUser={vi.fn()} selectedUser={null} />);
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });
});
