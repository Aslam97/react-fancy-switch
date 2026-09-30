# Website

Demo site for [`@omit/react-fancy-switch`](../packages/react-fancy-switch), built with Vite, React, Tailwind CSS v4 and react-hook-form.

## Scripts

| Command          | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `pnpm dev`       | Start the Vite dev server                                |
| `pnpm build`     | Type-check and create a production build in `dist/`      |
| `pnpm preview`   | Serve the production build locally                       |
| `pnpm lint`      | Run ESLint                                               |
| `pnpm typecheck` | Run the TypeScript compiler without emitting             |
| `pnpm test:e2e`  | Run the Playwright end-to-end tests against `pnpm build` |

The site imports the library from the workspace, so build the library first (or run `pnpm build` / `pnpm test:e2e` from the repository root, which lets Turborepo handle the ordering).

The Playwright tests need a browser: `pnpm exec playwright install --with-deps chromium`.
