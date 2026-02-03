export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground px-4">
      <svg
        className="w-12 h-12 sm:w-16 sm:h-16 mb-4 opacity-50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      <p className="text-base sm:text-lg font-medium">Start a conversation</p>
      <p className="text-xs sm:text-sm text-center">Type a message below to begin</p>
    </div>
  );
}
