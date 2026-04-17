# ping-toast — React test app

Interactive harness for `<PingToaster>` and the `toast()` API. Every prop is
wired to a button so you can change it and immediately fire a toast to verify
the config reflects the new value.

## Run

```bash
cd tests/react-app
npm install
npm run dev
```

Opens on http://localhost:5174.

## What this verifies

- **Prop reactivity** — changing `position`, `theme`, `animation`, `duration`,
  `background`, `foreground`, `radius` updates the next toast immediately
- **Prop reset** — removing a prop (toggling "theme overrides" → "clear") resets
  it to the factory default, not the last-set value
- **StrictMode** — the app is wrapped in `<StrictMode>`, so effects double-run
- **Multiple instances** — the "mount 2nd PingToaster" button mounts a second
  `<PingToaster>`. A dev-mode warning fires in the console; the last-mounted
  one's props win. Useful for catching accidental double-mounts

## When to use vs. the vanilla test-app

- `tests/test-app` → covers vanilla-JS `configure()` / `toast` API via CDN-ish HTML
- `tests/react-app` → covers the `<PingToaster>` React component + `toast`/`useToast` hooks
