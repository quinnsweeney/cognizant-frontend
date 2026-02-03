import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface ChatHeaderProps {
  onClear: () => void;
  isClearDisabled: boolean;
  onToggleSidebar: () => void;
  onNewChat: () => void;
}

export function ChatHeader({
  onClear,
  isClearDisabled,
  onToggleSidebar,
  onNewChat,
}: ChatHeaderProps) {
  return (
    <CardHeader className="border-b flex-shrink-0 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleSidebar}
            className="md:hidden"
            title="Open chat history"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
          <CardTitle className="text-lg sm:text-xl">AI Chat</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onNewChat}
            title="New chat"
          >
            <svg
              className="w-4 h-4 sm:mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden sm:inline">New</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            disabled={isClearDisabled}
            title="Clear chat"
          >
            <svg
              className="w-4 h-4 sm:mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="hidden sm:inline">Clear</span>
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}
