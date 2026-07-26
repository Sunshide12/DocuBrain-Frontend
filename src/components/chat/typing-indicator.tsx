"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shown while a message is in flight and we don't yet know which tool will
 * answer (no streaming — that only becomes known once the mutation resolves
 * and the real MessageBubble, with its AgentBadge, replaces this).
 */
export function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
      <div className="flex items-center gap-2.5 rounded-3xl rounded-bl-lg border border-border/60 bg-card px-4 py-3.5">
        <motion.span
          animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-primary"
        >
          <Sparkles className="h-4 w-4" />
        </motion.span>
        <Skeleton className="h-3 w-20 rounded-full" />
      </div>
    </motion.div>
  );
}
