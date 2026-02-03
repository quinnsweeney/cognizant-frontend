import { Card, CardFooter } from "@/components/ui/card";
import { ChatHeader, ChatInput, ChatSidebar, MessageList } from "@/components/chat";
import { useChatState } from "@/hooks/useChatState";
import { parseSSEStream } from "@/utils/streamParser";
import { useCallback, useEffect, useRef, useState } from "react";

export function ChatApp() {
  const {
    // Chat list
    chatList,
    isLoadingChats,
    currentChatId,
    loadChat,
    startNewChat,
    deleteChatById,
    // Current chat
    messages,
    status,
    setStatus,
    error,
    setError,
    addUserMessage,
    addAssistantMessage,
    appendToMessage,
    finalizeMessage,
    clearCurrentChat,
  } = useChatState();

  const [inputValue, setInputValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastPromptRef = useRef<string>("");

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus textarea on mount and when chat changes
  useEffect(() => {
    textareaRef.current?.focus();
  }, [currentChatId]);

  // Auto-create new chat if none selected and user starts typing
  const ensureChatExists = useCallback(() => {
    if (!currentChatId) {
      startNewChat();
    }
  }, [currentChatId, startNewChat]);

  const sendMessage = useCallback(
    async (prompt: string) => {
      if (!prompt.trim()) return;

      // Ensure we have a chat
      ensureChatExists();

      lastPromptRef.current = prompt;
      setError(null);

      // Add user message
      addUserMessage(prompt.trim());

      // Clear input
      setInputValue("");

      // Set loading state
      setStatus("loading");

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch("https://cognizant-backend-6bgd.vercel.app/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: prompt.trim() }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }

        if (!response.body) {
          throw new Error("No response body received");
        }

        // Add assistant message placeholder
        const assistantId = addAssistantMessage();
        setStatus("streaming");

        // Read the stream
        const reader = response.body.getReader();

        for await (const chunk of parseSSEStream(reader)) {
          if (chunk.text) {
            appendToMessage(assistantId, chunk.text);
          }
        }

        // Finalize the message
        finalizeMessage(assistantId);
        setStatus("idle");
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          setStatus("idle");
          return;
        }

        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        setStatus("error");
      } finally {
        abortControllerRef.current = null;
      }
    },
    [
      ensureChatExists,
      addUserMessage,
      addAssistantMessage,
      appendToMessage,
      finalizeMessage,
      setStatus,
      setError,
    ]
  );

  const handleSubmit = () => {
    sendMessage(inputValue);
  };

  const handleRetry = () => {
    if (lastPromptRef.current) {
      sendMessage(lastPromptRef.current);
    }
  };

  const handleCancel = () => {
    abortControllerRef.current?.abort();
    setStatus("idle");
  };

  const handleNewChat = () => {
    startNewChat();
    textareaRef.current?.focus();
  };

  const isDisabled = status === "loading" || status === "streaming";

  return (
    <div className="flex h-full w-full overflow-hidden" style={{ height: '100dvh' }}>
      {/* Sidebar */}
      <ChatSidebar
        chats={chatList}
        currentChatId={currentChatId}
        isLoading={isLoadingChats}
        onSelectChat={loadChat}
        onNewChat={handleNewChat}
        onDeleteChat={deleteChatById}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main chat area */}
      <Card className="flex-1 min-h-0 flex flex-col border-0 sm:border-l-0 md:border-l rounded-none sm:rounded-none md:rounded-r-xl overflow-hidden">
        <ChatHeader
          onClear={clearCurrentChat}
          isClearDisabled={messages.length === 0 && status === "idle"}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onNewChat={handleNewChat}
        />

        <MessageList
          ref={messagesEndRef}
          messages={messages}
          status={status}
          error={error}
          onRetry={handleRetry}
        />

        <CardFooter className="border-t p-3 sm:p-4 flex-shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <ChatInput
            ref={textareaRef}
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isDisabled={isDisabled}
          />
        </CardFooter>
      </Card>
    </div>
  );
}

export default ChatApp;
