# Changelog

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
- 6 positions — top/bottom x left/right/center
- XSS safe — all text auto-sanitized
- React adapter — `<PingToaster />` + `useToast()` hook
- Zero dependencies
- TypeScript with full type definitions
- ~5kb gzipped
