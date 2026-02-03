import { forwardRef } from "react";
import { CardContent } from "@/components/ui/card";
import type { ChatMessage, ChatStatus } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";
import { LoadingIndicator } from "./LoadingIndicator";
import { ErrorMessage } from "./ErrorMessage";
import { EmptyState } from "./EmptyState";

interface MessageListProps {
  messages: ChatMessage[];
  status: ChatStatus;
  error: string | null;
  onRetry: () => void;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  function MessageList({ messages, status, error, onRetry }, ref) {
    const showEmptyState = messages.length === 0 && status === "idle";

    return (
      <CardContent className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {showEmptyState && <EmptyState />}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {status === "loading" && <LoadingIndicator />}

        {status === "error" && error && (
          <ErrorMessage message={error} onRetry={onRetry} />
        )}

        <div ref={ref} />
      </CardContent>
    );
  }
);
