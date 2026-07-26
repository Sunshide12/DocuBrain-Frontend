---
name: clean-architecture-frontend
description: Clean architecture rules, scalability, modularity, and best practices for the Frontend (Next.js and React).
---

# Scalable Architecture & Best Practices Guide (Frontend)

When acting as a senior software engineer on the Frontend (DocuBrain-Frontend), apply these architectural principles. The goal is highly maintainable, modular, and predictable code.

## 1. Separation of Concerns (Smart vs Dumb Components)
- **Presentational ("Dumb") Components**: their only job is to receive `props` and render UI. No global state, no data fetching. (e.g. buttons, cards, inputs — usually Shadcn/UI components.)
- **Container ("Smart") Components**: responsible for calling TanStack Query hooks, managing state, and passing data down to "Dumb" components.
- **Strict rule**: never mix heavy business logic (bulk filtering, fetching, complex validation) inside a UI component's render/JSX.

## 2. Extracting Logic into Custom Hooks
- If a component has more than 2-3 `useState` calls or complex `useEffect`/`useQuery` logic, **extract that logic into a Custom Hook** in `src/hooks/` (e.g. `useUploadDocument`, `useChatMessages`).
- This enables reuse, makes testing easier, and keeps the component file visually clean.

## 3. App Router Architecture (Next.js)
- **Server Components (default)**: maximize use of React Server Components (RSC) for layout, SEO, and static/server-side rendering that doesn't need immediate interactivity.
- **Client Components (`"use client"`)**: use this directive **only when strictly necessary** (state hooks `useState`, effects `useEffect`, or browser interactivity like `onClick`).
- **Push "use client" as far down as possible**: don't put `"use client"` on the root `page.tsx` if only a small button needs interactivity — extract the button into its own component and mark only that.

## 4. Strict Typing (TypeScript)
- **`any` is forbidden**.
- Always define precise `interfaces`/`types` for component props and API (GraphQL) responses.
- Keep shared global types in `src/types/`, or pull them directly from generated definitions if using codegen.

## 5. State Management (Server State vs Client State)
- **Server state (async cache)**: use **TanStack Query** for all network requests (GraphQL). Never use manual `useEffect` + `fetch`. Use `invalidateQueries` and similar to keep data fresh.
- **Local client state**: use `useState` for simple UI state (modal open/close, controlled inputs). For state that must be shared globally and is purely UI (e.g. light/dark theme), use Context API or Zustand.

## 6. File Organization (Colocation)
- Group related files together for complex features. For a `Chat` view, don't scatter its logic across 10 distant folders — keep feature-specific components near where they're used.
- Use `src/components/ui/` strictly for reusable base design components (Shadcn).
- Use `src/lib/` for pure utility functions (date formatting, API clients) that don't depend on React.

---
Checkpoint: is "use client" pushed to leaf components, and is any `any` type eliminated?
