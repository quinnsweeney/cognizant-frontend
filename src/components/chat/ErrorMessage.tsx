import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex justify-center px-2">
      <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg px-3 py-2 sm:px-4 sm:py-3 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm text-center sm:text-left">{message}</span>
        <Button variant="ghost" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
}
