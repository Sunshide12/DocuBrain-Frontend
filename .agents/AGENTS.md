# DocuBrain-Frontend (Next.js App Router)
## Contexto Esencial
- Stack: Next.js (App Router, TS), TanStack Query, Shadcn UI, Tailwind CSS.
- Documentación detallada: consulta [STRUCTURE.md](file:///home/btwsunshide/Documents/Proyects/DocuBrain-Frontend/STRUCTURE.md) solo si es necesario.
## Comandos Rápidos
- Dev: `npm run dev`
- Build: `npm run build`
- Lint/Typecheck: `npm run lint` && `npx tsc --noEmit`
## Reglas Críticas del Workspace
1. **Componentes**: Usar componentes de Shadcn/UI ubicados en `@/components/ui`.
2. **Fetching Data**: Usar TanStack Query para llamadas GraphQL/REST.
3. **Imports**: Usar alias `@/` para imports absolutos dentro de `src/`.
4. **No Inspeccionar**: Ignorar `.next/`, `node_modules/`, `out/`, `build/`.
