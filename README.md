<a href="https://react-fancy-switch.netlify.app">
  <img src="https://i.postimg.cc/59Bc5bR5/Screenshot-2024-08-13-at-16-33-21.png" alt="React Fancy Switch" />
</a>

<p>
  <a href="https://github.com/Aslam97/react-fancy-switch/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/%40omit%2Freact-fancy-switch" alt="License" /></a>
  <a href="https://www.npmjs.com/package/@omit/react-fancy-switch"><img src="https://img.shields.io/npm/v/%40omit%2Freact-fancy-switch" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@omit/react-fancy-switch"><img src="https://img.shields.io/npm/dw/%40omit%2Freact-fancy-switch" alt="npm downloads" /></a>
  <a href="https://www.npmjs.com/package/@omit/react-fancy-switch"><img src="https://img.shields.io/npm/unpacked-size/%40omit%2Freact-fancy-switch" alt="Unpacked size" /></a>
</p>

# React Fancy Switch

An accessible, animated switch / segmented control component for React. It behaves like a radio group, animates a highlighter between options without framer-motion, and works with primitive or object options.

```bash
npm install @omit/react-fancy-switch
```

**Documentation:** see the package README at [`packages/react-fancy-switch`](packages/react-fancy-switch/README.md) (also shown on [npm](https://www.npmjs.com/package/@omit/react-fancy-switch)).

**Live demo:** https://react-fancy-switch.netlify.app (deployed from `website/`; pull requests get a Netlify deploy preview).

## Repository layout

| Path                          | Description                                                   |
| ----------------------------- | ------------------------------------------------------------- |
| `packages/react-fancy-switch` | The published `@omit/react-fancy-switch` library              |
| `website`                     | Demo site (Vite + React + Tailwind CSS) with end-to-end tests |

## Development

Requirements: Node.js 22.12 or newer and [pnpm](https://pnpm.io) (the version is pinned in `package.json` and picked up by Corepack).

```bash
pnpm install
pnpm dev        # start the demo site (builds the library first)
pnpm build      # build the library and the demo site
pnpm lint       # ESLint
pnpm typecheck  # TypeScript
pnpm test       # unit tests (Vitest)
pnpm test:e2e   # end-to-end tests (Playwright, needs `pnpm exec playwright install chromium` once)
pnpm format     # Prettier
```

## Other Projects

- [Minimal Tiptap Editor](https://github.com/Aslam97/shadcn-minimal-tiptap)
- [React Confirm Dialog](https://github.com/Aslam97/react-confirm-dialog)

## License

This project is open source and available under the [MIT License](LICENSE).
