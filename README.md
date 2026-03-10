# SMS Frontend

React frontend for the Student Management System — a clean admin panel for managing students, courses, and enrollments.

---

## Stack

- **React 18** with Vite
- **No UI library** — all components are hand-built with inline styles and CSS variables
- **Google Fonts** — Playfair Display, DM Mono, Instrument Sans

---

## Project Structure

```
src/
├── api/
│   └── client.js              # All API calls grouped by domain (auth, students, courses, enrollments)
├── components/
│   ├── common/UI.jsx           # Shared component library (Modal, Toast, Btn, Badge, Card, etc.)
│   ├── dashboard/Dashboard.jsx # Stats overview and getting-started guide
│   ├── students/Students.jsx   # Student list with CRUD
│   ├── courses/Courses.jsx     # Course catalog with CRUD
│   ├── enrollments/
│   │   ├── Enrollments.jsx     # Enrolled students list with detail modal
│   │   └── EnrollStudent.jsx   # Multi-course enrollment form
│   ├── layout/Layout.jsx       # App shell — collapsible sidebar + sticky topbar
│   └── login/Login.jsx         # Split-screen login page
├── hooks/
│   └── useFetch.js             # useFetch and usePaginated hooks
├── App.jsx                     # Root — session check, routing, global CSS
└── main.jsx
```

---

## Routing

The app uses simple state-based routing (no React Router). `App.jsx` holds a `view` state that determines which page component is rendered inside the `Layout` shell.

| View key | Component |
|---|---|
| `dashboard` | `Dashboard` |
| `students` | `Students` |
| `courses` | `Courses` |
| `enrollments` | `Enrollments` |
| `enroll` | `EnrollStudent` |

---

## Auth & Session

On mount, the app checks `sessionStorage` for a `tab_active` flag:

- **New tab / fresh open** — calls `POST /logout` to invalidate any lingering cookie, then shows the login screen.
- **Page refresh** — probes `GET /api/students` to verify the server session is still alive; redirects to login on 401/403.

On successful login the flag is set; on logout it is removed.

---

## Shared Components (`UI.jsx`)

| Component | Description |
|---|---|
| `Btn` | Button with `primary / secondary / danger / ghost` variants and a loading spinner state |
| `Modal` | Backdrop modal — slides up from bottom on mobile, centered on desktop |
| `Toast` | Fixed top-right notification (success/error, auto-dismisses after 3.5s) |
| `Badge` | Active/Inactive status pill |
| `Card / CardHeader` | Consistent card container |
| `FormField` | Label + error wrapper |
| `Input / Select / Textarea` | Styled form inputs (16px font size to prevent iOS zoom) |
| `Pagination` | Page number buttons |
| `Spinner` | Centered loading indicator |
| `EmptyState` | Empty list placeholder |

---

## Data Fetching

Two custom hooks in `useFetch.js`:

- **`useFetch(fetchFn, deps)`** — fires on mount and whenever deps change, returns `{ data, loading, error, refetch }`.
- **`usePaginated(fetchFn, initialPage, size)`** — extends `useFetch` with `page` state and re-fetches automatically on page change.

---

## Responsive Design

All views adapt between mobile and desktop using a `useIsMobile` hook (breakpoint at 640px or 768px depending on the view). Key differences:

- **Sidebar** — sticky on desktop, slides in as an overlay on mobile with a backdrop
- **Tables** — replaced with stacked card rows on mobile
- **Modals** — bottom sheet on mobile, centered dialog on desktop
- **Forms** — single-column on mobile, two-column grid on desktop

---

## Styling

Global design tokens are defined as CSS variables in `App.jsx` and injected via a `<style>` tag. No CSS files or CSS modules are used — all styles are inline with occasional `<style>` blocks for responsive rules.

Key tokens: `--cream`, `--ink`, `--ink-muted`, `--border`, `--green`, `--red`, `--font-display`, `--font-body`, `--font-mono`.

---

## Getting Started

```bash
npm install
npm run dev
```

The Vite dev server is expected to proxy `/api`, `/login`, and `/logout` to the Spring Boot backend. Configure this in `vite.config.js` if not already set up.