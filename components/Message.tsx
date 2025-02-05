import { memo } from "react";

export interface MessageProps {
  author: string;
  content: string;
  isNew?: boolean;
}

function Message({ author, content, isNew }: Readonly<MessageProps>) {
  const isUser = author !== "Bot";

  return (
    <article
      aria-atomic="true"
      className={`p-3 my-2 w-max max-w-xs rounded-lg transition-opacity duration-300 ${
        isNew ? "opacity-0 animate-fade-in" : "opacity-100"
      } ${
        isUser
          ? "bg-blue-600 text-white ml-auto" 
          : "bg-green-200 text-green-900"
      }`}
      aria-label={`${author} said: ${content}`}
      aria-live={isNew ? "polite" : "off"} 
    >
      <strong>{author}:</strong> {content}
    </article>
  );
}

const areEqual = (prevProps: MessageProps, nextProps: MessageProps) => {
  return (
    prevProps.author === nextProps.author &&
    prevProps.content === nextProps.content &&
    prevProps.isNew === nextProps.isNew
  );
};

export default memo(Message, areEqual);
