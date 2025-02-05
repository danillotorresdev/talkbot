import { screen, render, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Message from "@/components/Message";

describe("Message Component", () => {
  it("should render the message content with correct author", () => {
    render(<Message author="John Doe" content="Hello!" />);
    expect(screen.getByText("John Doe:")).toBeInTheDocument();
    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });

  it("should apply the correct styles for user messages", () => {
    render(<Message author="John Doe" content="Hey!" />);
    const message = screen.getByText("Hey!").closest("article");

    expect(message).toHaveClass("bg-blue-600", "text-white", "ml-auto");
  });

  it("should apply the correct styles for bot messages", () => {
    render(<Message author="Bot" content="Hello, user!" />);
    const message = screen.getByText("Hello, user!").closest("article");

    expect(message).toHaveClass("bg-green-200", "text-green-900");
  });

  it("should have opacity 0 and animation when isNew is true", async () => {
    render(<Message author="John Doe" content="New message!" isNew />);
    const message = screen.getByText("New message!").closest("article");

    await waitFor(() => {
      expect(message).toHaveClass("opacity-0", "animate-fade-in");
    });
  });

  it("should have opacity 100 when isNew is false", () => {
    render(<Message author="John Doe" content="Old message!" isNew={false} />);
    const message = screen.getByText("Old message!").closest("article");

    expect(message).toHaveClass("opacity-100");
  });
});
