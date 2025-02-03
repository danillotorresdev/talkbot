import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Sidebar from "@/components/Sidebar";
import { customRender } from "@/utils/renderWithProviders";

// Mock the LogoutButton to isolate Sidebar behavior
vi.mock("@/components/LogoutButton", () => ({
  default: () => <button data-testid="logout-button">Logout</button>,
}));

describe("Sidebar Component", () => {
  it("should render the user's name", () => {
    customRender(<Sidebar userName="John Doe" onSelectChat={vi.fn()} />);
    expect(screen.getByText(/👤 John Doe/i)).toBeInTheDocument();
  });

  it("should call onSelectChat when Chat Bot is clicked", () => {
    const mockOnSelectChat = vi.fn();
    customRender(<Sidebar userName="John Doe" onSelectChat={mockOnSelectChat} />);

    const chatButton = screen.getByText(/Chat Bot/i);
    fireEvent.click(chatButton);

    expect(mockOnSelectChat).toHaveBeenCalledTimes(1);
  });

  it("should render the LogoutButton", () => {
    customRender(<Sidebar userName="John Doe" onSelectChat={vi.fn()} />);
    expect(screen.getByTestId("logout-button")).toBeInTheDocument();
  });
});
