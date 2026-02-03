import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <Card
        className={cn(
          "max-w-[85%] sm:max-w-[75%] md:max-w-[70%] border-0 shadow-sm py-0 gap-0",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
          message.isStreaming && "animate-pulse"
        )}
      >
        <CardContent className="px-3 py-2 sm:px-4 sm:py-3 text-sm">
          {isUser ? (
            <p className="whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none break-words">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-2 ml-4 list-disc last:mb-0">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-2 ml-4 list-decimal last:mb-0">{children}</ol>
                  ),
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  code: ({ className, children, ...props }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <Badge variant="secondary" className="font-mono text-xs px-1 py-0">
                          {children}
                        </Badge>
                      );
                    }
                    // Extract language from className (e.g., "language-javascript")
                    const language = className?.replace("language-", "") ?? "";
                    return (
                      <Card className="bg-background/80 border my-2 py-0 gap-0">
                        {language && (
                          <div className="px-3 py-1 border-b">
                            <Badge variant="outline" className="text-xs">
                              {language}
                            </Badge>
                          </div>
                        )}
                        <ScrollArea className="w-full">
                          <CardContent className="p-2">
                            <code
                              className={cn(
                                "block text-xs font-mono whitespace-pre",
                                className
                              )}
                              {...props}
                            >
                              {children}
                            </code>
                          </CardContent>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </Card>
                    );
                  },
                  pre: ({ children }) => <div className="last:mb-0">{children}</div>,
                  h1: ({ children }) => (
                    <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-bold mb-2 mt-2 first:mt-0">{children}</h3>
                  ),
                  blockquote: ({ children }) => (
                    <Card className="border-l-4 border-l-primary bg-muted/50 my-2 py-0 gap-0 rounded-l-none">
                      <CardContent className="px-3 py-1 italic">
                        {children}
                      </CardContent>
                    </Card>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2 hover:no-underline"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                  hr: () => <Separator className="my-3" />,
                  table: ({ children }) => (
                    <ScrollArea className="w-full my-2">
                      <table className="w-full border-collapse text-sm">
                        {children}
                      </table>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-muted/50">{children}</thead>
                  ),
                  th: ({ children }) => (
                    <th className="border border-border px-2 py-1 text-left font-semibold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-border px-2 py-1">{children}</td>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
              {message.isStreaming && (
                <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
              )}
            </div>
          )}
          <p
            className={cn(
              "text-xs mt-2 opacity-60",
              isUser ? "text-right" : "text-left"
            )}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
