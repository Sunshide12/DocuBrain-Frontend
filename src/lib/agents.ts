import {
  Search,
  Calculator,
  GraduationCap,
  Sparkles,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export type AgentKey =
  | "document_qa"
  | "math_solver"
  | "quiz_generator"
  | "greetings"
  | "clarification";

export interface AgentMeta {
  key: string;
  label: string;
  icon: LucideIcon;
  /** Badge background/text/border classes. */
  badgeClass: string;
  /** Icon-only color, for contexts that already provide their own background. */
  iconClass: string;
}

const AGENT_META: Record<AgentKey, AgentMeta> = {
  document_qa: {
    key: "document_qa",
    label: "Document Q&A",
    icon: Search,
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  math_solver: {
    key: "math_solver",
    label: "Math Solver",
    icon: Calculator,
    badgeClass: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    iconClass: "text-orange-600 dark:text-orange-400",
  },
  quiz_generator: {
    key: "quiz_generator",
    label: "Quiz Generator",
    icon: GraduationCap,
    badgeClass: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    iconClass: "text-green-600 dark:text-green-400",
  },
  greetings: {
    key: "greetings",
    label: "Assistant",
    icon: Sparkles,
    badgeClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    iconClass: "text-violet-600 dark:text-violet-400",
  },
  clarification: {
    key: "clarification",
    label: "Clarification",
    icon: HelpCircle,
    badgeClass: "bg-muted text-muted-foreground border-border",
    iconClass: "text-muted-foreground",
  },
};

const FALLBACK_META: AgentMeta = {
  key: "unknown",
  label: "Assistant",
  icon: Sparkles,
  badgeClass: "bg-muted text-muted-foreground border-border",
  iconClass: "text-muted-foreground",
};

export function getAgentMeta(agentKey: string | null | undefined): AgentMeta {
  if (!agentKey) return FALLBACK_META;
  return AGENT_META[agentKey as AgentKey] ?? FALLBACK_META;
}
