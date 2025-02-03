import { memo } from "react";

export interface MessageProps {
  author: string;
  content: string;
  isNew?: boolean;
}

function Message({ author, content, isNew }: Readonly<MessageProps>) {
  const isUser = author !== "Bot";
  return (
    <div
      className={`p-3 my-2 w-max max-w-xs rounded-lg transition-opacity duration-300 ${
        isNew ? "opacity-0 animate-fade-in" : "opacity-100"
      } ${
        isUser
          ? "bg-blue-500 text-white ml-auto"
          : "bg-green-100 text-green-800"
      }`}
    >
      <strong>{author}:</strong> {content}
    </div>
  );
}

// Função para evitar re-renderizações desnecessárias
const areEqual = (prevProps: MessageProps, nextProps: MessageProps) => {
  return (
    prevProps.author === nextProps.author &&
    prevProps.content === nextProps.content &&
    prevProps.isNew === nextProps.isNew
  );
};

// Memoiza o componente Message
export default memo(Message, areEqual);
