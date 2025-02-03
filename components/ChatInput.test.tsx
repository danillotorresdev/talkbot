import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ChatInput from "@/components/ChatInput";

describe("ChatInput", () => {
  it("should render correctly", () => {
    render(<ChatInput sendMessage={vi.fn()} />);

    expect(screen.getByPlaceholderText("Type a message...")).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  it("should call sendMessage when clicking Send button", () => {
    const mockSendMessage = vi.fn();
    render(<ChatInput sendMessage={mockSendMessage} />);

    const input = screen.getByPlaceholderText("Type a message...");
    const sendButton = screen.getByText("Send");

    fireEvent.change(input, { target: { value: "Hello!" } });
    fireEvent.click(sendButton);

    expect(mockSendMessage).toHaveBeenCalledWith("Hello!");
  });

  it("should call sendMessage when pressing Enter", () => {
    const mockSendMessage = vi.fn();
    render(<ChatInput sendMessage={mockSendMessage} />);

    const input = screen.getByPlaceholderText("Type a message...");

    fireEvent.change(input, { target: { value: "Hello!" } });
    fireEvent.keyUp(input, { key: "Enter" });

    expect(mockSendMessage).toHaveBeenCalledWith("Hello!");
  });

  it("should clear input after sending a message", () => {
    const mockSendMessage = vi.fn();
    render(<ChatInput sendMessage={mockSendMessage} />);

    const input = screen.getByPlaceholderText("Type a message...");
    const sendButton = screen.getByText("Send");

    fireEvent.change(input, { target: { value: "Hello!" } });
    fireEvent.click(sendButton);

    expect(input).toHaveValue("");
  });

  it("should not call sendMessage for empty input", () => {
    const mockSendMessage = vi.fn();
    render(<ChatInput sendMessage={mockSendMessage} />);

    const sendButton = screen.getByText("Send");

    fireEvent.click(sendButton);

    expect(mockSendMessage).not.toHaveBeenCalled();
  });
});
