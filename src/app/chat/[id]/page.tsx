"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { ArrowLeft, Send, MessageSquare, GraduationCap } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { ChatMobileTabs, type ChatMobileView } from "@/components/chat/chat-mobile-tabs";
import { MessageBubble } from "@/components/chat/message-bubble";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { QuizPanel } from "@/components/quiz/QuizPanel";
import { useConversation } from "@/hooks/useConversation";
import { useSendMessage } from "@/hooks/useSendMessage";

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [activeMobileView, setActiveMobileView] = useState<ChatMobileView>("chat");
  const [desktopView, setDesktopView] = useState<"chat" | "quizzes">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const quizToastShownRef = useRef<Set<string>>(new Set());

  const { data, isLoading } = useConversation(conversationId);
  const sendMessageMutation = useSendMessage(conversationId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    sendMessageMutation.mutate(content);
    setContent("");
  };

  // Listen for QuizGenerationCompleted broadcast event
  useEffect(() => {
    if (!user) return;
    let channel: ReturnType<NonNullable<typeof import("@/lib/echo").echo>["private"]> | null = null;

    const subscribe = async () => {
      try {
        if (typeof window === "undefined") return;
        const { echo } = await import("@/lib/echo");
        if (!echo) return;

        channel = echo.private(`App.Models.User.${user.id}`);
        channel.listen(".QuizGenerationCompleted", (e: { document_id: string; status: string }) => {
          const key = `${e?.document_id}-${e?.status}`;
          if (e?.status === "ready" && !quizToastShownRef.current.has(key)) {
            quizToastShownRef.current.add(key);
            import("sonner").then(({ toast }) =>
              toast.success("¡El quiz está listo!", { duration: 4000 })
            );
            queryClient.invalidateQueries({ queryKey: ["documentQuizzes"] });
          }
        });
      } catch (err) {
        console.error("Echo subscription failed", err);
      }
    };

    subscribe();
    return () => {
      const channelName = channel?.name;
      if (channelName) {
        import("@/lib/echo").then(({ echo }) => echo?.leave(channelName));
      }
    };
  }, [user, queryClient]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [data?.conversation?.messages, sendMessageMutation.isPending]);

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading conversation...</div>;

  const conversation = data?.conversation;
  if (!conversation) return <div className="flex h-screen items-center justify-center">Conversation not found.</div>;

  const documentId = conversation.document?.id;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background md:flex-row">
      {/* ── Mobile top bar: back + tabs ── */}
      <div className="flex items-center gap-2 border-b border-border/50 bg-background px-3 py-2 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => router.back()}
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <ChatMobileTabs active={activeMobileView} onChange={setActiveMobileView} />
        </div>
      </div>

      {/* ── Left panel: PDF Viewer ── */}
      <div
        className={cn(
          "w-full min-h-0 flex-1 flex-col border-r border-border/50 bg-muted/10 md:flex md:w-[45%] md:flex-initial",
          activeMobileView === "document" ? "flex" : "hidden"
        )}
      >
        {/* Desktop back button */}
        <div className="hidden h-14 items-center border-b border-border/50 bg-background px-4 md:flex">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <span className="ml-4 font-semibold truncate">{conversation.title}</span>
        </div>
        <div className="flex-1 relative">
          {documentId ? (
            <iframe
              src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/documents/${documentId}/download`}
              className="absolute inset-0 w-full h-full border-0"
              title="PDF Viewer"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No document attached.
            </div>
          )}
        </div>
      </div>

      {/* ── Right panel: Chat + Quizzes ── */}
      <div
        className={cn(
          "relative w-full min-h-0 flex-1 flex-col bg-background md:z-10 md:flex md:w-[55%] md:flex-initial md:shadow-2xl",
          activeMobileView === "chat" || activeMobileView === "quizzes" ? "flex" : "hidden"
        )}
      >
        {/* Desktop header */}
        <div className="hidden h-14 shrink-0 items-center justify-between border-b border-border/50 bg-background px-4 md:flex">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold truncate">{conversation.title}</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-muted p-1 shrink-0">
            <button
              type="button"
              onClick={() => setDesktopView("chat")}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                desktopView === "chat"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Chat
            </button>
            <button
              type="button"
              onClick={() => setDesktopView("quizzes")}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                desktopView === "quizzes"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Quizzes
            </button>
          </div>
        </div>

        {/* ── QUIZ VIEW ── */}
        <div
          className={cn(
            "min-h-0 flex-1 flex-col",
            activeMobileView === "quizzes" ? "flex" : "hidden",
            desktopView === "quizzes" ? "md:flex" : "md:hidden"
          )}
        >
          <QuizPanel documentId={documentId ?? ""} conversationId={conversationId} />
        </div>

        {/* ── CHAT VIEW ── */}
        <div
          className={cn(
            "min-h-0 flex-1 flex-col",
            activeMobileView === "chat" ? "flex" : "hidden",
            desktopView === "chat" ? "md:flex" : "md:hidden"
          )}
        >
          <div className="no-scrollbar flex-1 overflow-y-auto p-4 md:p-6">
            <div className="space-y-4">
              <AnimatePresence>
                {conversation.messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    role={msg.role}
                    content={msg.content}
                    responseType={msg.response_type}
                    metadata={msg.metadata}
                    agentKey={msg.agent_key}
                  />
                ))}
              </AnimatePresence>
              {sendMessageMutation.isPending && <TypingIndicator />}
              <div ref={messagesEndRef} className="h-2" />
            </div>
          </div>
          <div className="p-4 md:p-6 bg-background border-t border-border/40">
            <form onSubmit={handleSend} className="flex gap-3 items-center max-w-4xl mx-auto">
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Ask a question, request a quiz, or send a math problem…"
                className="flex-1 bg-card border-border/60 shadow-sm focus-visible:ring-primary/50 rounded-full px-5 py-6 text-base"
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full h-12 w-12 shadow-sm"
                disabled={!content.trim() || sendMessageMutation.isPending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
