import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { forwardRef, type FormEvent, type KeyboardEvent } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isDisabled: boolean;
}

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  function ChatInput({ value, onChange, onSubmit, onCancel, isDisabled }, ref) {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmit();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      }
    };

    return (
      <form onSubmit={handleSubmit} className="flex w-full gap-2">
        <Textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Enter to send)"
          disabled={isDisabled}
          className="min-h-[44px] max-h-[120px] resize-none text-sm sm:text-base"
          rows={1}
        />
        {isDisabled ? (
          <Button
            type="button"
            variant="destructive"
            onClick={onCancel}
            className="shrink-0"
            size="default"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="hidden sm:inline">Cancel</span>
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={!value.trim()}
            className="shrink-0"
            size="default"
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <span className="hidden sm:inline">Send</span>
          </Button>
        )}
      </form>
    );
  }
);
