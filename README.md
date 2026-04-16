<div align="center">

# 🍞 PingToast

**The last toast library you'll ever need.**

Ultra-lightweight, zero-dependency toast notifications for React & vanilla JS.
**~5kb gzipped** · Animated icons · Action buttons · Confirm/Alert dialogs · Full TypeScript

[![npm](https://img.shields.io/npm/v/ping-toast?style=flat-square&color=6366f1)](https://npmjs.com/package/ping-toast)
[![size](https://img.shields.io/bundlephobia/minzip/ping-toast?style=flat-square&color=10b981)](https://bundlephobia.com/package/ping-toast)
[![downloads](https://img.shields.io/npm/dm/ping-toast?style=flat-square&color=f59e0b)](https://npmjs.com/package/ping-toast)
[![license](https://img.shields.io/npm/l/ping-toast?style=flat-square&color=ef4444)](https://github.com/KumarDeepak16/ping-toast/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/KumarDeepak16/ping-toast/ci.yml?style=flat-square)](https://github.com/KumarDeepak16/ping-toast/actions)

**[Live Demo & Docs](https://pingtoast.1619.in)** — **[Playground](https://pingtoast.1619.in/playground)** — **[GitHub](https://github.com/KumarDeepak16/ping-toast)**

</div>

---

## Why PingToast?

- 🪶 **5kb gzipped** — no runtime deps, no peer deps
- ⚛️ **React-first** — one `<PingToaster />`, one `useToast()` hook. Flat props, no nested config objects
- 🎨 **Theme anything** — inline-style overrides that always win (works in light & dark mode)
- 🌓 **Light/dark/auto** — respects `prefers-color-scheme` out of the box
- 💬 **Beyond toasts** — `confirm()`, `alert()`, `promise()`, action buttons, update-in-place
- 🎯 **Framework-agnostic** — Vanilla JS, Vue, Svelte, Angular all work via the same `toast` function
- 🧠 **Type-safe** — full TS definitions, zero `any` in the public API
- 📦 **Tree-shakeable** — import only what you use
- 🌐 **CDN-ready** — ships a `<script>`-tag bundle (no build step needed)

---

## Install

```bash
npm install ping-toast
# or
pnpm add ping-toast
# or
yarn add ping-toast
```

---

## Quick Start — React

### 1. Mount `<PingToaster />` once at your app root

```tsx
// app/layout.tsx or App.tsx
import { PingToaster } from 'ping-toast/react'

export default function App() {
  return (
    <>
      <PingToaster position="top-right" theme="auto" />
      <YourApp />
    </>
  )
}
```

### 2. Use `toast` anywhere

```tsx
import { toast } from 'ping-toast/react'

function SaveButton() {
  return <button onClick={() => toast.success('Saved!')}>Save</button>
}
```

### Or use the hook

```tsx
import { useToast } from 'ping-toast/react'

function MyComponent() {
  const { success, error, promise, confirm } = useToast()
  // ...
}
```

---

## Quick Start — Vanilla JS

```js
import { toast, configure } from 'ping-toast'

// Optional — configure once at app entry
configure({ position: 'top-right', duration: 3500, theme: 'auto' })

// Use anywhere
toast.success('Saved!')
toast.error('Failed', {
  action: { label: 'Retry', onClick: (id) => toast.dismiss(id) },
})
```

### CDN / Browser (zero build)

```html
<script src="https://cdn.jsdelivr.net/npm/ping-toast/dist/ping-toast.min.global.js"></script>
<script>
  PingToast.configure({ position: 'top-right' })
  PingToast.toast.success('Hello from CDN!')
</script>
```

---

## All Toast Types

```js
toast('Default notification')
toast.success('Saved!')
toast.error('Failed to connect')
toast.warning('Storage nearly full')
toast.info('Update available')
toast.loading('Processing...')    // stays until dismissed or updated
```

## Rich Toasts (title + description)

```js
toast.success('Deployed!', {
  title: 'Production',
  description: 'v2.1.0 → 3 regions',
  duration: 5000,
})
```

## Action Buttons (Undo, Retry, etc.)

```js
toast.error('File deleted', {
  action: {
    label: 'Undo',
    onClick: (id) => {
      toast.dismiss(id)
      toast.success('Restored!')
    },
  },
})
```

## Promise — Auto loading → success/error

```js
toast.promise(fetch('/api/save'), {
  loading: 'Saving...',
  success: (res) => `Saved ${res.items} items`,
  error:   (err) => err.message,
})
```

## Confirm & Alert — Replace `window.confirm` / `window.alert`

```js
const ok = await toast.confirm('Delete permanently?', {
  confirm: 'Delete',
  cancel:  'Keep',
})
if (ok) toast.success('Deleted')

await toast.alert('Session expired — please log in again')
```

## Update & Dismiss

```js
const id = toast.loading('Uploading...')

// 2s later...
toast.update(id, { type: 'success', message: 'Upload complete!', duration: 3000 })

toast.dismiss(id)    // dismiss one
toast.dismissAll()   // dismiss all
```

## Custom HTML

```js
toast.custom(() => `
  <div style="padding:12px 16px">
    <strong>Custom render</strong> — anything goes
  </div>
`, { duration: 4000 })
```

## Events — Listen to show / dismiss / update

```js
const unsubscribe = toast.on('show', (t) => {
  console.log('Toast shown:', t.id, t.message)
})

// Later...
unsubscribe()
```

In React, use the hook for auto-cleanup:

```tsx
import { useToastListener } from 'ping-toast/react'

useToastListener('show', (t) => console.log(t))
```

---

## `<PingToaster />` — Props Reference

All props are **optional**. Flat — no nested config objects.

### Core behavior

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'top-right' \| 'top-left' \| 'top-center' \| 'bottom-right' \| 'bottom-left' \| 'bottom-center'` | `'top-right'` | Where toasts appear |
| `duration` | `number` | `3500` | Default auto-dismiss ms. `0` = never |
| `maxVisible` | `number` | `5` | Max toasts on screen at once |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Light, dark, or follow system |
| `closable` | `boolean` | `true` | Show close button on every toast |
| `progress` | `boolean` | `true` | Show progress bar countdown |
| `dedup` | `boolean` | `true` | Collapse duplicate messages into one |

### Theme overrides (any CSS color value)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `background` | `string` | `—` | Toast background color |
| `foreground` | `string` | `—` | Text color |
| `radius` | `string` | `14px` | Border radius — `'8px'`, `'999px'`, etc. |
| `font` | `string` | system | `font-family` override |

### Example — Themed toaster

```tsx
<PingToaster
  position="top-right"
  theme="dark"
  duration={4000}
  background="#18181b"
  foreground="#fafafa"
  radius="12px"
/>
```

---

## Toast Options (2nd arg to any `toast()` call)

```ts
toast.success('Saved!', {
  id:          'custom-id',          // explicit ID (for update/dismiss)
  title:       'Success',            // bold title line
  description: 'Extra details',      // secondary text
  duration:    5000,                 // override global duration
  closable:    false,                // hide × button on this toast
  progress:    false,                // hide progress bar on this toast
  action:      { label: 'Undo', onClick: (id) => {} },
  icon:        '<svg>...</svg>',     // custom icon HTML
  className:   'my-custom-class',    // extra CSS class
  style:       { fontSize: '16px' }, // inline styles
})
```

---

## React API Surface (`ping-toast/react`)

| Export | Kind | Description |
|--------|------|-------------|
| `<PingToaster />` | component | Drop-in setup. Place in App root. |
| `toast` | function | Main function — same as vanilla. `toast('msg')`, `.success()`, `.error()`, `.promise()`, `.confirm()`, `.alert()`, `.update()`, `.dismiss()`, `.dismissAll()`, `.custom()`, `.on()` |
| `useToast()` | hook | Returns `{ toast, success, error, warning, info, loading, promise, confirm, alert, update, dismiss, dismissAll, custom }` |
| `useToastListener(event, fn)` | hook | Subscribe to `'show'` / `'dismiss'` / `'update'` with auto-cleanup |
| `configure(props)` | function | Manual configure (rarely needed — `<PingToaster />` does this via props) |

---

## Vanilla API Surface (`ping-toast`)

| Export | Description |
|--------|-------------|
| `toast` | Main function with `.success/.error/.warning/.info/.loading/.promise/.confirm/.alert/.update/.dismiss/.dismissAll/.custom/.on` methods |
| `configure(props)` | Configure position, duration, theme. Call once at app entry. Same props as `<PingToaster />`. |
| `dismiss(id)` | Dismiss a specific toast |
| `dismissAll()` | Dismiss all active toasts |
| `update(id, options)` | Mutate an existing toast live |
| `on(event, callback)` | Subscribe to lifecycle events. Returns unsubscribe fn. |

---

## TypeScript

Full types included — no `@types/...` needed.

```ts
import type {
  ToastType,          // 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading'
  ToastPosition,      // 6 position variants
  ThemeMode,          // 'light' | 'dark' | 'auto'
  ToastOptions,       // 2nd-arg options for toast()
  PingToasterProps,   // props for <PingToaster />
  ToastState,         // toast state (passed to event callbacks)
  PromiseMessages,    // toast.promise() messages
  ToastEvent,         // 'show' | 'dismiss' | 'update'
} from 'ping-toast'
```

---

## AI Agent Skill

Help AI coding agents (Claude Code, Cursor, Copilot) use PingToast automatically.

Drop [`pingtoasterskill.md`](https://pingtoast.1619.in/#ai-skill) in your project root — agents read it and use PingToast for any "add notification", "show confirm dialog", "add undo toast", or "replace `window.alert`" request.

---

## Browser Support

Chrome / Edge / Firefox / Safari — last 2 versions. ES2020 target.

---

## Comparison

| Feature | PingToast | react-hot-toast | sonner |
|---------|:---------:|:---------------:|:------:|
| Size (gzipped) | **5kb** | 6kb | 5kb |
| Zero deps | ✅ | ✅ | ✅ |
| Works outside React | ✅ | ❌ | ❌ |
| `confirm()` dialog | ✅ | ❌ | ❌ |
| `alert()` dialog | ✅ | ❌ | ❌ |
| Action buttons | ✅ | ❌ | ✅ |
| Promise API | ✅ | ✅ | ✅ |
| Update in place | ✅ | ❌ | ✅ |
| Animated icons | ✅ | ✅ | ❌ |
| CDN build | ✅ | ❌ | ❌ |
| Swipe to dismiss | ✅ | ❌ | ✅ |
| AI skill file | ✅ | ❌ | ❌ |

---

## Recipes

### Loading → Success/Error pattern

```ts
const id = toast.loading('Saving draft...')
try {
  await api.save()
  toast.update(id, { type: 'success', message: 'Draft saved!', duration: 2000 })
} catch (err) {
  toast.update(id, { type: 'error', message: err.message, duration: 4000 })
}
```

### Undo delete pattern

```ts
function deleteFile(file) {
  const snapshot = { ...file }
  doDelete(file.id)

  toast.error(`Deleted ${file.name}`, {
    duration: 6000,
    action: {
      label: 'Undo',
      onClick: (id) => {
        restore(snapshot)
        toast.dismiss(id)
        toast.success('Restored')
      },
    },
  })
}
```

### Confirm before destructive action

```ts
async function onDelete() {
  const ok = await toast.confirm('Delete this file permanently?', {
    confirm: 'Delete',
    cancel: 'Keep it',
  })
  if (!ok) return
  await api.delete()
  toast.success('Deleted')
}
```

### Dark mode with custom brand color

```tsx
<PingToaster
  theme="dark"
  background="#0a0a0a"
  foreground="#fafafa"
  radius="16px"
  font="'Inter', system-ui, sans-serif"
/>
```

---

## Contributing

```bash
git clone https://github.com/KumarDeepak16/ping-toast
cd ping-toast/lib
npm install
npm run dev       # watch build
npm run build     # production build
```

See [CONTRIBUTING.md](https://github.com/KumarDeepak16/ping-toast/blob/main/CONTRIBUTING.md).

## License

MIT © [Deepak Kumar](https://github.com/KumarDeepak16)

---

<div align="center">

**[⭐ Star on GitHub](https://github.com/KumarDeepak16/ping-toast)** — if you like it

Made with ❤️ for developers who hate bloated dependencies.

</div>
