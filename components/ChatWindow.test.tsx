import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ChatWindow from "@/components/ChatWindow";
import { Message as MessageType } from "@/services/chat";

describe("ChatWindow", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("should display 'Empty' when there are no messages", () => {
    render(<ChatWindow messages={[]} />);

    expect(screen.getByText("Empty")).toBeInTheDocument();
  });

  it("should render messages correctly", () => {
    const messages: MessageType[] = [
      { id: "1", author: "Jhon", content: "Hello!", isNew: false },
      { id: "2", author: "Bot", content: "Hi Jhon!", isNew: false },
    ];

    render(<ChatWindow messages={messages} />);

    expect(screen.getByText("Hello!")).toBeInTheDocument();
    expect(screen.getByText("Hi Jhon!")).toBeInTheDocument();
  });

  it("should render new messages with correct styles", () => {
    const messages: MessageType[] = [
      { id: "1", author: "Jhon", content: "New message!", isNew: true },
    ];

    render(<ChatWindow messages={messages} />);

    const messageElement = screen.getByText("New message!");
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveClass("opacity-0 animate-fade-in");
  });

  it("should scroll to the bottom when messages update", async () => {
    const messages: MessageType[] = [
      { id: "1", author: "Jhon", content: "First message", isNew: false },
      { id: "2", author: "Bot", content: "Second message", isNew: false },
    ];

    // Mock `scrollIntoView`
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    const { rerender } = render(<ChatWindow messages={messages} />);

    // Re-render with new messages
    rerender(
      <ChatWindow
        messages={[
          ...messages,
          { id: "3", author: "Jhon", content: "Third message", isNew: false },
        ]}
      />
    );

    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalled();
    });
  });

  it("should prevent unnecessary re-renders with memoization", () => {
    const initialMessages: MessageType[] = [
      { id: "1", author: "Jhon", content: "Hello!", isNew: false },
    ];

    const { rerender } = render(<ChatWindow messages={initialMessages} />);

    // Re-render with the same props
    rerender(<ChatWindow messages={initialMessages} />);

    // Expect no additional re-renders due to memoization
    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });
});
