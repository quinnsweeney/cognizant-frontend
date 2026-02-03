import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { forwardRef, useCallback, type FormEvent, type KeyboardEvent, type FocusEvent } from "react";

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

    // Reset scroll position when keyboard closes (blur event)
    const handleBlur = useCallback((e: FocusEvent<HTMLTextAreaElement>) => {
      // Small delay to allow keyboard to close first
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, 100);
    }, []);

    // Ensure input stays visible when focused
    const handleFocus = useCallback((e: FocusEvent<HTMLTextAreaElement>) => {
      // Scroll the input into view with a slight delay for iOS
      setTimeout(() => {
        e.target.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 300);
    }, []);

    return (
      <form onSubmit={handleSubmit} className="flex w-full gap-2 items-end">
        <Textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder="Type your message... (Enter to send)"
          disabled={isDisabled}
          className="min-h-[44px] max-h-[120px] resize-none text-base"
          rows={1}
          autoComplete="off"
          autoCorrect="on"
          enterKeyHint="send"
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
