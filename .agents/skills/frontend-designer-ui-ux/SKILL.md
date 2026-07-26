---
name: frontend-designer-ui-ux
description: Strict design, UI/UX, component, and animation rules to keep the Frontend visually consistent.
---

# Design & UI/UX Guide (Frontend Designer)

When designing or modifying interfaces in the DocuBrain Frontend, follow these conventions strictly to preserve the app's modern, consistent, premium look & feel.

## 1. Component System (Shadcn UI)
- **Don't reinvent the wheel**: before building a custom button, modal, card, dropdown, or input from scratch, use **Shadcn UI** components.
- Import via the standard alias: `import { Button } from "@/components/ui/button"`.
- If a needed component isn't installed yet, propose it to the user with the install command (e.g. `npx shadcn-ui@latest add dialog`).

## 2. Animations & Micro-interactions (Framer Motion)
The project is defined by fluid, dynamic interfaces.
- Use **Framer Motion** (`import { motion, AnimatePresence } from 'framer-motion'`).
- **Element entrance (lists/pages)**: smooth entrance animations (`initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}`).
- **Popups, alerts, modals**: always wrap in `<AnimatePresence>` so both enter and exit animate elegantly (`exit={{ opacity: 0, scale: 0.95 }}`).

## 3. Styling (Tailwind CSS, strict)
- **Zero raw CSS**: all styling via Tailwind utility classes.
- **Semantic colors (dark-mode ready)**: ALWAYS use theme color variables.
  - Correct: `bg-background`, `text-primary`, `bg-muted`, `border-border`.
  - Wrong: `bg-white`, `text-black`, `bg-gray-100` (these break dark mode).
- **Visual feedback**: every interactive element needs a fluid hover state (e.g. `hover:bg-accent hover:text-accent-foreground transition-all duration-200`).

## 4. User Experience (UX)
- **Loading states**: whenever using `useQuery` or `useMutation` (TanStack Query), handle `isLoading` with `Skeleton` components or subtle spinners. The UI must never freeze.
- **Action feedback**: after actions (save, delete, submit), always fire a **Toast** notifying success or error.
- **Clean UI (whitespace)**: favor clean layouts with generous `flex`, `gap-*`, and `p-*` for visual breathing room. Use `text-muted-foreground` for subtitles and reading hierarchy.

## 5. Responsive Design
- Components must adapt automatically. Use `flex-col md:flex-row` and similar patterns.
- Avoid aggressive fixed widths (`w-[500px]`); prefer `w-full max-w-md`.

---
Checkpoint: is the UI dark-mode safe (no raw bg-white/text-black), and does every async action have a loading + toast state?
