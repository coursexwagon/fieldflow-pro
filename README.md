# FieldFlow Pro

Mobile field service software for contractors who hate paperwork.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Components**: Custom UI components with Radix primitives
- **Animations**: Framer Motion
- **State**: Zustand + TanStack Query

## Design System

- **Primary Background**: #0A0A0B (deep charcoal)
- **Secondary Background**: #141416 (cards)
- **Accent**: #F97316 (safety orange)
- **Text Primary**: #FAFAFA
- **Text Secondary**: #A1A1AA

## Pages

### Marketing
- `/` - Landing page with hero, features, pricing, FAQ
- `/login` - Login page with Google OAuth
- `/signup` - Sign up page with trade selection

### App (Dashboard)
- `/app` - Dashboard home with stats, jobs, quick actions
- `/app/schedule` - Calendar and list view of jobs
- `/app/jobs` - Filterable job list
- `/app/customers` - Customer CRM

## Development

```bash
bun run dev
```

## Build

```bash
bun run build
```

---

Built for contractors. No AI slop.
