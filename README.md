# 🧹 Sift

> **Don’t organize it. Dump it.**  
> A calm, editorial command center for messy human thoughts. Turn unstructured text dumps into structured tasks, events, ideas, and reminders.

---

## ✨ Key Features

### 🧠 1. Natural Language Sifting Engine
- **Deterministic Processing:** Instant natural language parsing via custom classification rules and `chrono-node` without relying on mandatory external LLMs.
- **Entity & Date Extraction:** Converts relative time expressions (*"tonight"*, *"tomorrow at 4pm"*, *"Friday"*) into ISO timestamps and local calendar labels.
- **Classification Engine:** Categorizes raw input into `TASK`, `EVENT`, `REMINDER`, `IDEA`, `NOTE`, or `REFERENCE`.
- **Urgency Detection:** Detects context and explicit keywords to assign `URGENT`, `HIGH`, `MEDIUM`, or `LOW` priority.

### 🎨 2. Editorial Glassmorphism Design System
- **Adaptive System Themes:** Native support for System Light (*Sunset Blush & Warm White*) and Dark (*Deep Burgundy*) modes with a single-click sidebar toggle.
- **Translucent Glass Surfaces:** Custom CSS backdrop-blur utilities (`.glass-panel`, `.glass-card`, `.glass-input`, `.glass-sidebar`) with glossy borders and depth shadows.
- **Collapsible Layout:** Collapsible desktop sidebar (collapses to an icon rail) and collapsible workspace stream sections.
- **Responsive Mobile Shell:** Mobile-first sticky header with slide-over backdrop navigation drawer.

### 🎯 3. Workspace & Execution Flow
- **Current Focus:** Pin critical items to a high-visibility execution strip at the top of the workspace.
- **Stream Grouping:** Automatic real-time sorting into *Current Focus*, *Today*, *Tomorrow*, *Upcoming*, and *Inbox & Ideas*.
- **Inline Corrections:** Hover card controls open an in-place glass editor to correct titles, change classifications, update priorities, or tweak dates.
- **Cmd + K Command Palette:** Global modal with real-time keyword search, keyboard arrow navigation, and type-filter tabs.

### 📜 4. Raw Dump History & Memory Trail
- **Session Linking:** Every raw text dump is preserved in a `dumps` database session.
- **Audit Trail:** View historical raw text blobs alongside the structured items they generated.

### 🔐 5. Security & Multi-User Architecture
- **Isolated Workspaces:** Every item, dump, project, and tag is strictly scoped to `userId`.
- **Stateless Auth:** Bcrypt password hashing + `jose` JWT cookies (`sift_session`) managed via Next.js Edge Middleware.
- **Role-Based Admin Console:** Secure `/admin` dashboard protected via server-side admin credentials (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) to inspect and manage user feedback submissions.

---

## 🗄️ Database Architecture

Sift uses **Drizzle ORM** configured with `@libsql/client`.
text

           ┌───────────────┐
           │     users     │
           └───────┬───────┘
                   │ 1:N
    ┌──────────────┼──────────────┐
    ▼              ▼              ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│ projects │ │ dumps │ │ feedback │
└─────┬──────┘ └─────┬──────┘ └────────────┘
│ 1:N │ 1:N
└──────┐ ┌────┘
▼ ▼
┌────────────┐
│ items │
└─────┬──────┘
│ M:N
┌─────┴──────┐
│ item_tags │
└─────┬──────┘
│ M:N
┌─────┴──────┐
│ tags │
└────────────┘

text


- **Local Development:** Uses local file-based SQLite (`file:data/sift.db`).
- **Production:** Serverless SQLite at the edge via **Turso (LibSQL)**.

---

## ⚙️ Environment Variables

To run Sift locally or in production, configure the following variables in `.env`:

```env
# Database
DATABASE_URL="file:data/sift.db"
TURSO_DATABASE_URL="libsql://sift-db-yourusername.turso.io"
TURSO_AUTH_TOKEN="your-turso-auth-token"

# Security
JWT_SECRET="your-secure-random-jwt-secret"

# Admin Dashboard
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-strong-admin-password"

# Optional Cloud AI (Fallback layer)
AI_PROVIDER="none" # Options: "gemini" | "none"
GEMINI_API_KEY="your-gemini-api-key"
Built by Girum Endalkachew