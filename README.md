<div align="center">

<img src="https://pingtoast.1619.in/pingtoast-og.webp" alt="PingToast" height="96" />

# PingToast

**Ultra-lightweight toast notifications for React & vanilla JS.**

Zero deps · ~6kb gzipped · Animated · Fully typed

[![npm](https://img.shields.io/npm/v/ping-toast?style=flat-square&color=6366f1)](https://npmjs.com/package/ping-toast)
[![size](https://img.shields.io/bundlephobia/minzip/ping-toast?style=flat-square&color=10b981)](https://bundlephobia.com/package/ping-toast)
[![downloads](https://img.shields.io/npm/dm/ping-toast?style=flat-square&color=f59e0b)](https://npmjs.com/package/ping-toast)
[![license](https://img.shields.io/npm/l/ping-toast?style=flat-square&color=ef4444)](https://github.com/KumarDeepak16/ping-toast/blob/main/LICENSE)

**[Docs](https://pingtoast.1619.in)** · **[Playground](https://pingtoast.1619.in/playground)** · **[Changelog](https://pingtoast.1619.in/changelog)**

</div>

---

## Install

```bash
npm install ping-toast
```

## Quick Start — React

```tsx
import { PingToaster, toast } from 'ping-toast/react'

export default function App() {
  return (
    <>
      <PingToaster position="top-right" theme="auto" />
      <YourApp />
    </>
  )
}

// then anywhere
toast.success('Saved!')
```

## Quick Start — Vanilla / Vue / Svelte / Angular

```ts
import { toast, configure } from 'ping-toast'

configure({ position: 'top-right', theme: 'auto' })

toast.success('Works everywhere!')
```

## Core API

```ts
toast('Hello')
toast.success('Saved!')
toast.error('Failed')
toast.warning('Careful')
toast.info('Update available')
toast.loading('Processing...')

toast.promise(fetchData(), {
  loading: 'Loading...',
  success: (d) => `Got ${d.count} items`,
  error:   (e) => e.message,
})

await toast.confirm('Delete?', { confirm: 'Delete', cancel: 'Keep' })
await toast.alert('Session expired')

toast.update(id, { type: 'success', message: 'Done' })
toast.dismiss(id)
toast.dismissAll()
```

## Features

- **6 toast types** — default, success, error, warning, info, loading
- **5 animations** — slide, fade, scale, bounce, flip
- **Promise API** — auto loading → success/error
- **Action buttons** — undo, retry, anything
- **Confirm / Alert dialogs** — drop-in replacements for `window.confirm` / `window.alert`
- **Full theming** — flat props, works in light & dark
- **Accessible** — ARIA live regions, `prefers-reduced-motion` support
- **Zero deps, ~6kb gzipped, fully typed**

## Full documentation

Everything — every prop, every option, every pattern — is at **[pingtoast.1619.in](https://pingtoast.1619.in)**.

| Section | What it covers |
|---------|----------------|
| [**Quick Start**](https://pingtoast.1619.in/#quickstart) | Two-step setup for React and vanilla |
| [**Usage Patterns**](https://pingtoast.1619.in/#usage) | Declarative vs imperative vs zero-config + debug checklist |
| [**Live Demo**](https://pingtoast.1619.in/#demo) | Click every toast type, see the snippet |
| [**Positions**](https://pingtoast.1619.in/#positions) | All 6 positions with live preview |
| [**Promise API**](https://pingtoast.1619.in/#promise) | Loading → success/error in one call |
| [**Action Buttons**](https://pingtoast.1619.in/#actions) | Undo, retry, any inline action |
| [**Theming**](https://pingtoast.1619.in/#theming) | Light, dark, auto, custom colors |
| [**API Reference**](https://pingtoast.1619.in/#api) | Every method, prop, and option |
| [**Playground**](https://pingtoast.1619.in/playground) | Try every config live |
| [**Changelog**](https://pingtoast.1619.in/changelog) | All releases, dated and categorized |
| [**AI Agent Skill**](https://pingtoast.1619.in/#ai-skill) | Ready-to-paste context for Claude / Cursor / Copilot |

## Links

- **npm** — [npmjs.com/package/ping-toast](https://npmjs.com/package/ping-toast)
- **GitHub** — [github.com/KumarDeepak16/ping-toast](https://github.com/KumarDeepak16/ping-toast)
- **Issues** — [github.com/KumarDeepak16/ping-toast/issues](https://github.com/KumarDeepak16/ping-toast/issues)

## License

MIT © [Deepak Kumar](https://github.com/kumardeepak16)
