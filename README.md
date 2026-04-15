# PingToast

> Ultra-lightweight, zero-dependency toast notification system.  
> **~5kb gzipped** · Animated icons · Action buttons · Confirm/Alert dialogs · TypeScript

[![npm](https://img.shields.io/npm/v/ping-toast)](https://npmjs.com/package/ping-toast)
[![size](https://img.shields.io/bundlephobia/minzip/ping-toast)](https://bundlephobia.com/package/ping-toast)
[![CI](https://github.com/KumarDeepak16/ping-toast/actions/workflows/ci.yml/badge.svg)](https://github.com/KumarDeepak16/ping-toast/actions)
[![license](https://img.shields.io/npm/l/ping-toast)](https://github.com/KumarDeepak16/ping-toast/blob/main/LICENSE)

**[Live Demo & Docs](https://pingtoast.1619.in)** · **[GitHub](https://github.com/KumarDeepak16/ping-toast)**

---

## Install

```bash
npm install ping-toast
```

---

## Vanilla JS

```js
import { toast, createToaster } from 'ping-toast'

createToaster({ position: 'top-right', theme: 'auto' })

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
// App.tsx
import { PingToaster } from 'ping-toast/react'

<PingToaster position="top-right" theme="auto" config={{ radius: '16px' }} />
```

```tsx
// Any component
import { useToast } from 'ping-toast/react'

const { success, error, promise, confirm } = useToast()
```

---

## API

```js
toast('Default')
toast.success('Saved!')
toast.error('Failed')
toast.warning('Careful')
toast.info('Update available')
toast.loading('Processing...')

// Promise
toast.promise(fetchData(), {
  loading: 'Fetching...',
  success: (data) => `Got ${data.length} items`,
  error: (err) => err.message,
})

// Action buttons
toast.error('Deleted', {
  action: { label: 'Undo', onClick: (id) => { toast.dismiss(id); toast.success('Restored!') } },
})

// Confirm / Alert
const ok = await toast.confirm('Delete?', { confirm: 'Delete', cancel: 'Keep' })
await toast.alert('Session expired')

// Update & dismiss
const id = toast.loading('Uploading...')
toast.update(id, { type: 'success', message: 'Done!', duration: 3000 })
toast.dismiss(id)
toast.dismissAll()
```

---

## `<PingToaster />` Props

| Prop | Type | Default |
|------|------|---------|
| `position` | `ToastPosition` | `'top-right'` |
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

---

## Development

```bash
git clone https://github.com/KumarDeepak16/ping-toast.git
cd ping-toast
npm install
npm run dev          # Watch mode
npm run build        # Build library
npm run test:app     # Start test playground
```

### Docker

```bash
docker compose up    # Start test app at localhost:5173
```

### Project Structure

```
src/
  core.ts            # Toast engine
  styles.ts          # Embedded CSS
  icons.ts           # Animated SVG icons
  types.ts           # TypeScript definitions
  index.ts           # Vanilla JS exports
  react.ts           # React adapter
tests/
  test-app/          # Interactive test playground
.github/
  workflows/ci.yml   # CI (Node 18/20/22) + auto-publish
  ISSUE_TEMPLATE/    # Bug report & feature request templates
  PULL_REQUEST_TEMPLATE.md
```

### Release

```bash
npm run release:patch  # 1.0.0 → 1.0.1
npm run release:minor  # 1.0.0 → 1.1.0
npm run release:major  # 1.0.0 → 2.0.0
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT — [Deepak Kumar](https://github.com/KumarDeepak16)
