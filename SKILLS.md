# Antigravity Editor Skills.md

**Full-Stack Web Development + UI/UX Mastery**  
*Specializing in MERN + Heavy Next.js + TypeScript (2026 Edition)*

---

## 🧬 Core Identity
- **Stack**: MERN (MongoDB, Express, React, Node.js) **heavily powered by Next.js 15 (App Router) + TypeScript**
- **Philosophy**: Blazing-fast, type-safe, production-grade apps with pixel-perfect UI/UX and zero runtime surprises.
- **Editor Setup**: VS Code + custom "Antigravity" theme (dark/neon cyber-minimal) + extensions below.

---

## 🔥 Languages & Core Tech

| Category          | Skills (Expert Level)                          | Daily Tools / Ecosystem |
|-------------------|------------------------------------------------|-------------------------|
| **TypeScript**    | Advanced TS (5.8+), generics, utility types, infer, branded types, Zod integration | `tsconfig.json` strict mode, `tsc --noEmit` |
| **JavaScript**    | ES2025, modules, async iterators, top-level await | — |
| **Next.js**       | App Router, Server Components, Server Actions, Partial Prerendering (PPR), Streaming, Route Handlers, Middleware, `next/font`, `next/image` | Next.js 15 Canary + Turbopack |
| **React**         | 19 (Concurrent Features), Server Components, Suspense, useOptimistic, useActionState, useFormStatus | React Compiler (if enabled) |

---

## 🧩 Full-Stack Architecture

### Frontend / UI Layer
- **Styling**: Tailwind CSS v4 (JIT, arbitrary values, `@apply`, plugins), CSS Modules, `clsx`/`tailwind-merge`, **Shadcn/UI** + custom component library
- **Component Design**: Radix UI primitives, Headless UI, Framer Motion (advanced animations, layout transitions, scroll-triggered), Aceternity UI, Magic UI
- **State Management**: Zustand (with middleware), TanStack Query v5 (server-state), Jotai (atomic), React Server State patterns
- **Forms & Validation**: React Hook Form + Zod resolver, Conform (type-safe forms)
- **UI/UX Tooling**: 
  - Figma → Code (Anima, Locofy, or manual)
  - Design Systems (tokens with Tailwind + CSS variables)
  - Accessibility (axe, eslint-plugin-jsx-a11y, ARIA)
  - Performance (Lighthouse 100, Core Web Vitals obsession)

### Backend / API Layer
- **Node.js**: Express + Next.js Route Handlers / Server Actions (preferred hybrid)
- **tRPC** or **Next.js API + Zod** for end-to-end typesafety
- **Authentication**: NextAuth.js v5 (with Prisma Adapter), Clerk, Supabase Auth, Lucia + JWT
- **Authorization**: CASL, Permify, or custom RBAC with Zod schemas
- **File Uploads**: UploadThing, AWS S3 + presigned URLs

### Database & ORM
- **MongoDB** + **Mongoose** (legacy MERN) **OR** **Prisma** (current default for type-safety)
- **Drizzle ORM** (when raw SQL performance needed)
- Query optimization, indexing, aggregation pipelines, vector search (if AI features)

### DevOps & Deployment
- **Vercel** (primary — edge functions, KV, Blob, Postgres)
- Docker + Docker Compose (local dev)
- CI/CD: GitHub Actions, Turborepo
- Monitoring: Sentry, OpenTelemetry, Vercel Analytics
- Caching: Next.js Cache, Redis (Upstash), React Cache

---

## 🛠️ Editor & Productivity Stack (Antigravity Setup)

**VS Code Extensions I Live In**:
- `dbaeumer.vscode-eslint` + `esbenp.prettier-vscode`
- `bradlc.vscode-tailwindcss`
- `yoavbls.pretty-ts-errors`
- `mikestead.dotenv`
- `prisma.prisma`
- `ms-ceintl.vscode-language-packer` (i18n)
- `github.copilot` + `github.copilot-chat` (heavily used)
- `antfu.iconify` + `antfu.unocss` (if needed)
- `streetsidesoftware.code-spell-checker`
- `eamodio.gitlens` + `github.vscode-github-actions`
- `ms-playwright.playwright`
- `oven.bun` (Bun as package manager when possible)

**Workspace Settings** (`settings.json`):
```json
{
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "tailwindCSS.experimental.classRegex": ["cn\$$   ([^)]*)\   $$"],
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" }
}