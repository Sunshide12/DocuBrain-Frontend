"use client";

import { motion } from "framer-motion";
import { getAgentMeta } from "@/lib/agents";
import { cn } from "@/lib/utils";

interface AgentBadgeProps {
  agentKey: string | null | undefined;
  className?: string;
}

export function AgentBadge({ agentKey, className }: AgentBadgeProps) {
  const { label, icon: Icon, badgeClass } = getAgentMeta(agentKey);

  return (
    <motion.span
      initial={{ opacity: 0, y: -2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        badgeClass,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </motion.span>
  );
}
