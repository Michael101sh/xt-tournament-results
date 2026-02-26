# XT Tournament — Final Results

A single-page application that displays tournament results from a provided API. Players are listed in a paginated, searchable, and filterable table with clear visual indicators for suspected cheaters.

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** — build tool with HMR and API proxy
- **TailwindCSS 4** — utility-first styling
- **TanStack Query v5** — server-state management and data fetching
- **TanStack Table v8** — headless table logic (pagination, columns, row models)
- **Vitest** + **Testing Library** — unit and component tests

## Features

- Paginated table with custom pagination (first/prev/page numbers/next/last, page jump dropdown, rows-per-page selector)
- Column-header level filter (rookie / amateur / pro)
- Free-text search across all player attributes (name, id, level, score)
- Suspect players highlighted with a red row background and a "Suspect" badge
- Capitalized player names, score progress bars, level badges
- Debounced search input with request cancellation via AbortSignal
- Deferred loading overlay to avoid flicker on fast responses
- State persistence to localStorage (pagination, filters, search)
- Global React Error Boundary
- Responsive layout down to 720px width
- Portal-based tooltips that render above overflow containers

## Project Structure

```
src/
  dal/                  # Data access layer (API calls)
  hooks/                # Custom React hooks
  lib/                  # Utility functions (cn, capitalize)
  types/                # TypeScript interfaces
  components/
    data-table/         # Generic reusable table (DataTable, Pagination, etc.)
    ui/                 # Shared UI primitives (Tooltip)
    ...                 # Feature components (Header, PlayerTable, SearchInput, etc.)
  test/                 # Test setup and utilities
```

## Prerequisites

- **Node.js** 18+
- The tournament server executable (`serverWin.exe`, `serverLx`, or `serverMac64`) placed in the project root

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the tournament server**

   ```bash
   # Windows
   ./serverWin.exe

   # Linux
   ./serverLx

   # Mac
   ./serverMac64
   ```

   The server listens on `http://localhost:20000`.

3. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open `http://localhost:5173`. The Vite proxy forwards `/api` requests to the tournament server.

## Production Build

```bash
npm run build
```

Copy the contents of `dist/` into the same directory as the server executable. The app is then accessible at `http://localhost:20000`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once (CI) |

## Testing

97 tests across 21 test files covering utilities, hooks, DAL, and all components.

```bash
npm run test:run
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/players?start=<n>&n=<n>[&level=<level>&search=<term>]` | Paginated player list. Total count in `x-total` header. |
| `GET /api/v1/players/suspects` | Static list of suspected cheater IDs. |
