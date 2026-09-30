# Changelog

## 1.1.0

### Fixed

- Keyboard navigation no longer breaks when a consumer passes an `onKeyDown` prop: the handler is now composed with the built-in one instead of replacing it.
- Arrow keys skip disabled options instead of getting stuck on them, and `Home` / `End` / `Space` are supported as described in the WAI-ARIA radio group pattern.
- When the selected option is disabled, the first enabled option becomes the tab stop so the component stays reachable with the keyboard.
- Pressing an arrow key with an empty `options` array no longer throws.
- Object options without a value no longer crash the component (`undefined.toString()`), and duplicate values no longer trigger duplicate React key warnings.
- The highlighter is positioned relative to the container's padding box (`top: 0; left: 0` on a `position: relative` root), so it stays aligned when the container uses `justify-content` / `align-items` values other than `flex-start`.
- With `highlighterIncludeMargin`, the highlighter now covers the whole margin box; vertical margins used to offset it without adjusting its height.
- The highlighter is measured before the first paint (`useLayoutEffect`), removing the initial grow animation, and it is re-measured when options or option sizes change, not only when the container resizes.
- A controlled `value` is derived during render instead of being synchronised through an effect, removing a stale frame after each change.
- Object options without a label fall back to their value instead of rendering the text `undefined`.
- Ref callbacks no longer return a value (required by React 19 types).

### Changed

- The root element is `position: relative` by default. Pass a `style` prop to override it.
- When the selected option disappears from `options` (uncontrolled usage) the selection falls back to the first option.
- The default group `aria-label` is omitted when `aria-labelledby` is provided.
- `getOptionProps()` is now typed as `OptionProps` instead of `Record<string, any>`; `OptionValueOf`, `ResolvedOption`, `RenderOptionProps` and `OptionProps` are exported.
- The CommonJS build is a plain CJS module (`dist/react-fancy-switch.cjs`) instead of a UMD bundle. The UMD bundle could not be used from a `<script>` tag anyway because it depended on a non-existent `react/jsx-runtime` global.
- Type declarations are bundled into a single file and published for both module formats (`index.d.ts` / `index.d.cts`), fixing type resolution under `moduleResolution: node16` / `bundler`.
- `react-dom` is no longer listed as a peer dependency (it was never imported).
- Added `sideEffects: false`, a README and the license to the published package.

## 1.0.6

Last release before this changelog was introduced.
