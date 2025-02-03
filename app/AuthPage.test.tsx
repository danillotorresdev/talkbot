import AuthPage from "@/app/page";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mockando useRouter do Next.js
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mockando localStorage
vi.stubGlobal("localStorage", {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
});

describe("AuthPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("should render the login form", () => {
    render(<AuthPage />);

    expect(screen.getByText("Welcome to TalkBot")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
    expect(screen.getByText("Start Chat")).toBeInTheDocument();
  });

  it("should allow the user to type in the input field", () => {
    render(<AuthPage />);

    const input = screen.getByPlaceholderText("Enter your name");
    fireEvent.change(input, { target: { value: "John Doe" } });

    expect(input).toHaveValue("John Doe");
  });

  it("should save the username and navigate to '/chat' when submitted", () => {
    render(<AuthPage />);

    const input = screen.getByPlaceholderText("Enter your name");
    const submitButton = screen.getByText("Start Chat");

    fireEvent.change(input, { target: { value: "John Doe" } });
    fireEvent.click(submitButton);

    expect(localStorage.setItem).toHaveBeenCalledWith("chatUserName", "John Doe");
    expect(mockPush).toHaveBeenCalledWith("/chat");
  });

  it("should not navigate or save username if input is empty", () => {
    render(<AuthPage />);

    const submitButton = screen.getByText("Start Chat");

    fireEvent.click(submitButton);

    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
