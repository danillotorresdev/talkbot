import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BotTypingIndicator from "@/components/BotTypingIndicator";

describe("BotTypingIndicator", () => {
  it("should render without crashing", () => {
    render(<BotTypingIndicator isBotTyping={false} />);
  });

  it("should display 'Bot is typing...' when isBotTyping is true", () => {
    render(<BotTypingIndicator isBotTyping={true} />);
    expect(screen.getByText("Bot is typing...")).toBeInTheDocument();
  });

  it("should not display 'Bot is typing...' when isBotTyping is false", () => {
    render(<BotTypingIndicator isBotTyping={false} />);
    expect(screen.queryByText("Bot is typing...")).not.toBeInTheDocument();
  });
});
