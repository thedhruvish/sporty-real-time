# Sporty - Real-time Sports Updates

Sporty is a modern, high-performance web application for delivering real-time sports updates. Built with a focus on speed, type safety, and developer experience, it leverages a cutting-edge tech stack to provide seamless live event tracking.

[🎥 **Watch the Demo Video**](./public/sporty-demo.mp4)

## 🚀 Features

- **Real-time Updates**: WebSocket integration for instant live match events.
- **Type Safety**: End-to-end type safety with TypeScript, tRPC-like patterns, and shared validation.
- **Modern UI**: sleek, responsive interface built with Shadcn UI and TailwindCSS v4.
- **Efficient Routing**: File-based routing with TanStack Router.
- **Robust Backend**: scalable Express server with Drizzle ORM and PostgreSQL.
- **Monorepo Architecture**: Managed with TurboRepo for efficient build and development workflows.

## 🛠️ Tech Stack

### Frontend (`apps/web`)

- **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) & [TanStack Query](https://tanstack.com/query)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/)

### Backend (`apps/server`)

- **Runtime**: [Node.js](https://nodejs.org/) (Development via [tsx](https://github.com/privatenumber/tsx))
- **Framework**: [Express](https://expressjs.com/)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Real-time**: [ws](https://github.com/websockets/ws) (WebSocket)
- **Build**: [tsdown](https://github.com/unjs/tsdown) & [Bun](https://bun.sh/) (for standalone binary compilation)

### Shared Packages (`packages/`)

- **`@sporty/db`**: Database schema, Drizzle configuration, and queries.
- **`@sporty/validation`**: Shared Zod schemas for API validation and type inference.
- **`@sporty/config`**: Shared configuration (TypeScript, ESLint, etc.).
- **`@sporty/env`**: Environment variable validation and strict typing.

### Infrastructure

- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))
- **Monorepo Tooling**: [TurboRepo](https://turbo.build/) & [PNPM Workspaces](https://pnpm.io/workspaces)

## 📡 WebSocket Integration

The project uses the raw `ws` library for high-performance real-time communication.

- **Path**: `/ws`
- **Authentication**: Connection requires a valid `token` passed as a query parameter (e.g., `ws://localhost:3000/ws?token=<YOUR_TOKEN>`).
- **Heartbeat**: The server performs a ping/pong check every 30 seconds to maintain active connections and clean up stale ones.
- **Targeted Broadcasting**:
  - **Broadcast**: Send messages to all connected clients.
  - **Match Specific**: Send updates only to clients subscribed to a specific `matchId`.

## 📂 Project Structure

```
sporty/
├── apps/
│   ├── web/            # Frontend application
│   └── server/         # Backend API & WebSocket server
├── packages/
│   ├── config/         # Shared configurations
│   ├── db/             # Database schema & Drizzle ORM setup
│   ├── env/            # Environment variable definitions
│   ├── inter-types/    # Shared interface types
│   └── validation/     # Shared Zod validation schemas
├── biome.json          # Linter/Formatter config
└── package.json        # Root workspace config
```

## 🏁 Getting Started

### Prerequisites

- **Node.js**: v20+ recommended
- **PNPM**: Package manager (`npm install -g pnpm`)
- **PostgreSQL**: Local instance or cloud provider (e.g., Neon)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/thedhruvish/sporty-real-time.git
   cd sporty-real-time
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Environment Setup:**
   - Copy `.env.example` to `.env` in `apps/server/` and `apps/web/` based on their respective examples.
   - Ensure your database connection string is set in `apps/server/.env` (and `packages/db/.env` if used for migrations).

4. **Database Setup:**
   Push the schema to your database:
   ```bash
   pnpm run db:push
   ```

### Running the Project

Start the development server for all apps (Web + Server):

```bash
pnpm run dev
```

- **Web App**: [http://localhost:3001](http://localhost:3001)
- **API Server**: [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

| Command                | Description                                           |
| :--------------------- | :---------------------------------------------------- |
| `pnpm run dev`         | Start all applications in development mode (parallel) |
| `pnpm run build`       | Build all applications and packages                   |
| `pnpm run check`       | Run Biome formatting and linting check                |
| `pnpm run check-types` | Run TypeScript type checking across the workspace     |
| `pnpm run db:push`     | Push schema changes to the database (Drizzle Kit)     |
| `pnpm run db:studio`   | Open Drizzle Studio to manage database content        |
| `pnpm run db:generate` | Generate SQL migrations from schema                   |
