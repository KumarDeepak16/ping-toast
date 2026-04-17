# Changelog

## 1.0.5 (2026-04-17)

### Fixes

- `<PingToaster />` now REPLACES the config on each render — omitting a prop resets it to the factory default, matching React intuition. Previously, once you set e.g. `position="bottom-left"` then removed the prop, the old value would stick around
- `<PingToaster />` and `configure()` are now cleanly separated: the React component does full-replace (props = config), while vanilla `configure({ theme: 'dark' })` still merges so existing theme overrides survive

### DX

- Warn in development when more than one `<PingToaster />` instance is mounted. Multiple instances silently let the last-mounted one's props override the rest — the warning points you to the conflict so "my position prop isn't working" stops being a mystery

## 1.0.4 (2026-04-17)

### Features

- **New** `animation` prop on `<PingToaster />` — choose from `slide` (default), `fade`, `scale`, `bounce`, `flip`
- **New** `gap` prop — pixels between stacked toasts (default `10`)
- **New** `offset` prop — pixels from the screen edge (default `16`)
- **New** mirrored enter/exit transitions — every animation variant now exits the same way it entered, with matched easing
- **New** FLIP-based stacking — when a new toast arrives, existing siblings smoothly tween to their new position instead of snapping
- **New** shared CSS timing tokens (`--pe`, `--pes`, `--peb`, `--pdi`, `--pdo`) — tweakable from your own stylesheet
- Honors `prefers-reduced-motion` for accessibility across every animation variant

### Fixes

- `<PingToaster />` prop updates now reflect in Next.js App Router / React Server Components — library emits the `"use client"` directive in the React entry so the component hydrates and its effect actually runs
- `configure()` no longer wipes `background`, `foreground`, `radius`, or `font` when called with partial props — theme overrides now survive subsequent `configure()` calls
- Changing `position` at runtime now fully propagates — added baseline `top/bottom/left/right: auto` resets so old sides no longer stick
- Config applies **before** the first paint on the client — switched to isomorphic `useLayoutEffect` so there's no flicker between defaults and chosen props on mount
- Dedup no longer flashes a dismiss + re-enter. Duplicates now pulse the existing toast and reset its timer in place
- `maxVisible` enforcement now eases the oldest toast out when the stack fills up — neighbors smoothly rise into the vacated space

### Performance

- CSS + class names compressed aggressively at build time — ~15% smaller payload
- Confirm / alert dialogs moved from inline styles to CSS classes

## 1.0.3

### Fixes

- Minor stability improvements and internal refinements

## 1.0.2

### Fixes

- Minor stability improvements

## 1.0.1

### Fixes

- Minor stability improvements

## 1.0.0 (2026-04-15)

### Features

- 6 toast types: default, success, error, warning, info, loading
- Animated SVG icons with draw animations
- Promise API — auto transitions loading to success/error
- Action buttons — Undo, Retry, View, etc.
- `toast.confirm()` — replace `window.confirm()`
- `toast.alert()` — replace `window.alert()`
- Swipe to dismiss (touch + mouse)
- Full theming via CSS variables + JS API
- Custom HTML render via `toast.custom()`
- Event system — show, dismiss, update events
- Deduplication + queue management
- 6 positions — top/bottom × left/right/center
- XSS safe — all text auto-sanitized
- React adapter — `<PingToaster />` + `useToast()` hook
- Zero dependencies
- TypeScript with full type definitions
- ~5kb gzipped
