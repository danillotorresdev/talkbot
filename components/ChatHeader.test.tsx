import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ChatHeader from "@/components/ChatHeader";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("ChatHeader", () => {
  it("should render correctly", () => {
    render(<ChatHeader />);
    expect(screen.getByText("Admin Panel")).toBeInTheDocument();
  });

  it("should render the 'Back' button when onBack is provided", () => {
    render(<ChatHeader onBack={vi.fn()} />);
    expect(screen.getByText("← Back")).toBeInTheDocument();
  });

  it("should call onBack when 'Back' button is clicked", () => {
    const mockOnBack = vi.fn();
    render(<ChatHeader onBack={mockOnBack} />);

    const backButton = screen.getByText("← Back");
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  it("should navigate to '/admin' when 'Admin Panel' is clicked", () => {
    render(<ChatHeader />);

    const adminButton = screen.getByText("Admin Panel");
    fireEvent.click(adminButton);

    expect(mockPush).toHaveBeenCalledWith("/admin");
  });
});
