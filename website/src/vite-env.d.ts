/// <reference types="vite/client" />

/**
 * `true` when the bundle is built by a Vercel deployment. Injected at build
 * time by `vite.config.ts` so that Vercel-only scripts are not loaded from
 * builds served elsewhere (local previews, other hosts).
 */
declare const __VERCEL_DEPLOYMENT__: boolean
