interface BotTypingIndicatorProps {
  isBotTyping: boolean;
}

export default function BotTypingIndicator({
  isBotTyping,
}: Readonly<BotTypingIndicatorProps>) {
  return (
    <div className="mt-2 text-gray-500 flex items-center justify-start">
      <span className="animate-pulse h-5">{isBotTyping && 'Bot is typing...'}</span>
    </div>
  );
}
