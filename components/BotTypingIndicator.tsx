interface BotTypingIndicatorProps {
  isBotTyping: boolean;
}

export default function BotTypingIndicator({
  isBotTyping,
}: Readonly<BotTypingIndicatorProps>) {
  if (!isBotTyping) return null;

  return (
    <p
      className="mt-2 text-gray-500 flex items-center justify-start animate-pulse h-5"
      aria-live="polite"
    >
      Bot is typing...
    </p>
  );
}
