import { useCallback, useEffect, useState } from "react";
import { compress, decompress } from "compress-json";
import type { Chat, ChatMessage, ChatStatus, ChatSummary } from "@/types/chat";
import { generateId } from "@/utils/generateId";

const STORAGE_KEY = "chat-history-compressed";

interface StoredChat {
  id: string;
  title: string;
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface StoredState {
  chats: StoredChat[];
  currentChatId: string | null;
}

// Load state from localStorage
function loadStoredState(): StoredState | null {
  try {
    const compressed = localStorage.getItem(STORAGE_KEY);
    if (!compressed) return null;
    const parsed = JSON.parse(compressed);
    return decompress(parsed) as StoredState;
  } catch (err) {
    console.error("Failed to load chat state:", err);
    return null;
  }
}

// Save state to localStorage
function saveStoredState(state: StoredState): void {
  try {
    const compressed = compress(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compressed));
  } catch (err) {
    console.error("Failed to save chat state:", err);
  }
}

// Convert stored chat to internal Chat type
function hydrateChat(stored: StoredChat): Chat {
  return {
    ...stored,
    messages: stored.messages.map((msg) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    })),
    createdAt: new Date(stored.createdAt),
    updatedAt: new Date(stored.updatedAt),
  };
}

// Convert internal Chat to storable format
function dehydrateChat(chat: Chat): StoredChat {
  return {
    ...chat,
    messages: chat.messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp.toISOString(),
    })),
    createdAt: chat.createdAt.toISOString(),
    updatedAt: chat.updatedAt.toISOString(),
  };
}

// Generate chat summary from chat
function getChatSummary(chat: Chat): ChatSummary {
  return {
    id: chat.id,
    title: chat.title,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
    messageCount: chat.messages.length,
  };
}

// Generate title from messages
function generateTitle(messages: ChatMessage[], fallback: string): string {
  const firstUserMessage = messages.find((m) => m.role === "user");
  if (firstUserMessage) {
    const content = firstUserMessage.content;
    return content.slice(0, 50) + (content.length > 50 ? "..." : "");
  }
  return fallback;
}

export function useChatState() {
  const [chats, setChats] = useState<Chat[]>(() => {
    const stored = loadStoredState();
    return stored ? stored.chats.map(hydrateChat) : [];
  });

  const [currentChatId, setCurrentChatId] = useState<string | null>(() => {
    const stored = loadStoredState();
    return stored?.currentChatId ?? null;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const stored = loadStoredState();
    if (stored?.currentChatId) {
      const currentChat = stored.chats.find((c) => c.id === stored.currentChatId);
      if (currentChat) {
        return currentChat.messages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
    }
    return [];
  });

  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  // Derived state
  const chatList: ChatSummary[] = chats.map(getChatSummary);
  const isLoadingChats = false;

  // Save to localStorage whenever state changes
  useEffect(() => {
    // Skip saving if messages are still streaming
    const hasStreamingMessage = messages.some((m) => m.isStreaming);
    if (hasStreamingMessage) return;

    // Build the state to save, merging current messages into the chats array
    const chatsToSave = chats.map((chat) => {
      if (chat.id === currentChatId && messages.length > 0) {
        return {
          ...chat,
          title: generateTitle(messages, chat.title),
          messages,
          updatedAt: new Date(),
        };
      }
      return chat;
    });

    const state: StoredState = {
      chats: chatsToSave.map(dehydrateChat),
      currentChatId,
    };
    saveStoredState(state);
  }, [chats, currentChatId, messages]);

  const loadChat = useCallback(
    (chatId: string) => {
      if (chatId === currentChatId) return;

      // Save current messages to chats before switching
      if (currentChatId && messages.length > 0) {
        const nonStreamingMessages = messages.filter((m) => !m.isStreaming);
        if (nonStreamingMessages.length > 0) {
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === currentChatId
                ? {
                    ...chat,
                    title: generateTitle(nonStreamingMessages, chat.title),
                    messages: nonStreamingMessages,
                    updatedAt: new Date(),
                  }
                : chat
            )
          );
        }
      }

      // Load the selected chat
      const chat = chats.find((c) => c.id === chatId);
      if (chat) {
        setCurrentChatId(chat.id);
        setMessages(chat.messages);
        setError(null);
      } else {
        setError("Chat not found");
      }
    },
    [chats, currentChatId, messages]
  );

  const startNewChat = useCallback(() => {
    // Save current messages to chats before creating new
    if (currentChatId && messages.length > 0) {
      const nonStreamingMessages = messages.filter((m) => !m.isStreaming);
      if (nonStreamingMessages.length > 0) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId
              ? {
                  ...chat,
                  title: generateTitle(nonStreamingMessages, chat.title),
                  messages: nonStreamingMessages,
                  updatedAt: new Date(),
                }
              : chat
          )
        );
      }
    }

    const newChat: Chat = {
      id: generateId(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMessages([]);
    setError(null);
  }, [currentChatId, messages]);

  const deleteChatById = useCallback(
    (chatId: string) => {
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      if (chatId === currentChatId) {
        setCurrentChatId(null);
        setMessages([]);
      }
    },
    [currentChatId]
  );

  const addUserMessage = useCallback((content: string): string => {
    const id = generateId();
    const message: ChatMessage = {
      id,
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    return id;
  }, []);

  const addAssistantMessage = useCallback((): string => {
    const id = generateId();
    const message: ChatMessage = {
      id,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, message]);
    return id;
  }, []);

  const appendToMessage = useCallback((id: string, text: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, content: msg.content + text } : msg
      )
    );
  }, []);

  const finalizeMessage = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, isStreaming: false } : msg))
    );
  }, []);

  const clearCurrentChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setStatus("idle");
  }, []);

  return {
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
  };
}
