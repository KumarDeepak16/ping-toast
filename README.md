# PingToast

> Ultra-lightweight, zero-dependency toast notification system.  
> **~5kb gzipped** · Animated icons · Action buttons · Confirm/Alert dialogs · TypeScript

[![npm](https://img.shields.io/npm/v/ping-toast)](https://npmjs.com/package/ping-toast)
[![size](https://img.shields.io/bundlephobia/minzip/ping-toast)](https://bundlephobia.com/package/ping-toast)
[![license](https://img.shields.io/npm/l/ping-toast)](https://github.com/kumardeepak16/ping-toast)

**[Live Demo & Docs](https://pingtoast.1619.in)** · **[GitHub](https://github.com/kumardeepak16/ping-toast)**

---

## Install

```bash
npm install ping-toast
```

---

## Vanilla JS

```js
import { toast, createToaster } from 'ping-toast'

// One-time setup
createToaster({ position: 'top-right', theme: 'auto' })

// Use anywhere
toast.success('Saved!')
```

**CDN:**
```html
<script src="https://cdn.jsdelivr.net/npm/ping-toast/dist/ping-toast.min.global.js"></script>
<script>
  PingToast.createToaster({ position: 'top-right' })
  PingToast.toast.success('Hello!')
</script>
```

---

## React

```tsx
// App.tsx — one component
import { PingToaster } from 'ping-toast/react'

export default function App() {
  return (
    <>
      <PingToaster
        position="top-right"
        theme="auto"
        config={{ success: '#22c55e', error: '#ef4444', radius: '16px' }}
      />
      <MyApp />
    </>
  )
}
```

```tsx
// Any component — useToast hook
import { useToast } from 'ping-toast/react'

function SaveButton() {
  const { success, error, promise, confirm } = useToast()

  return (
    <button onClick={() =>
      promise(save(), { loading: 'Saving...', success: 'Saved!' })
    }>
      Save
    </button>
  )
}
```

---

## API

```js
// Toast types
toast('Default')
toast.success('Saved!')
toast.error('Failed')
toast.warning('Careful')
toast.info('Update available')
toast.loading('Processing...')

// Promise tracking
toast.promise(fetchData(), {
  loading: 'Fetching...',
  success: (data) => `Got ${data.length} items`,
  error: (err) => err.message,
})

// Action buttons
toast.error('Deleted', {
  action: {
    label: 'Undo',
    onClick: (id) => { toast.dismiss(id); toast.success('Restored!') },
  },
})

// Confirm / Alert (replaces window.confirm & window.alert)
const ok = await toast.confirm('Delete?', { confirm: 'Delete', cancel: 'Keep' })
await toast.alert('Session expired')

// Update & dismiss
const id = toast.loading('Uploading...')
toast.update(id, { type: 'success', message: 'Done!', duration: 3000 })
toast.dismiss(id)
toast.dismissAll()

// Title + description
toast.success('Deployed', {
  title: 'Production',
  description: 'v2.1.0 deployed to 3 regions',
})

// Custom HTML
toast.custom(() => '<div>Custom content</div>', { duration: 5000 })

// Events
const off = toast.on('show', (t) => console.log(t))
off() // unsubscribe
```

---

## `<PingToaster />` Props

| Prop | Type | Default |
|------|------|---------|
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'top-right'` |
| `duration` | `number` | `3500` |
| `maxVisible` | `number` | `5` |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` |
| `closable` | `boolean` | `true` |
| `progress` | `boolean` | `true` |
| `dedup` | `boolean` | `true` |
| `config` | `ThemeVars` | `—` |

## `config` (ThemeVars)

| Key | CSS Variable | Default |
|-----|-------------|---------|
| `success` | `--pt-success` | `#22c55e` |
| `error` | `--pt-error` | `#ef4444` |
| `warning` | `--pt-warning` | `#f59e0b` |
| `info` | `--pt-info` | `#3b82f6` |
| `background` | `--pt-bg` | `#ffffff` |
| `foreground` | `--pt-fg` | `#222222` |
| `radius` | `--pt-radius` | `14px` |
| `font` | `--pt-font` | `system-ui` |

## Toast Options

| Option | Type | Default |
|--------|------|---------|
| `type` | `'default' \| 'success' \| 'error' \| 'warning' \| 'info' \| 'loading'` | `'default'` |
| `title` | `string` | — |
| `description` | `string` | — |
| `duration` | `number` | global |
| `action` | `{ label: string, onClick: (id) => void }` | — |
| `closable` | `boolean` | global |
| `progress` | `boolean` | global |
| `icon` | `string` (HTML) | auto |
| `className` | `string` | — |
| `style` | `CSSStyleDeclaration` | — |

---

## License

MIT — [Deepak Kumar](https://github.com/kumardeepak16)
