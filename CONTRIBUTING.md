# Contributing to PingToast

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/KumarDeepak16/ping-toast.git
cd ping-toast
npm install
npm run dev    # Watch mode
```

## Project Structure

```
src/
  core.ts      # Main toast engine
  styles.ts    # Embedded CSS
  icons.ts     # Animated SVG icons
  types.ts     # TypeScript definitions
  index.ts     # Vanilla JS exports
  react.ts     # React adapter (PingToaster, useToast)
tests/
  test-app/    # Test website for manual testing
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build library (ESM, CJS, IIFE, types) |
| `npm run dev` | Watch mode |
| `npm run test:app` | Start test website |

## Making Changes

1. Fork the repo
2. Create a branch: `git checkout -b feat/my-feature`
3. Make your changes
4. Build: `npm run build`
5. Test with the test app: `npm run test:app`
6. Commit: `git commit -m "feat: description"`
7. Push: `git push origin feat/my-feature`
8. Open a Pull Request

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `refactor:` — Code change that neither fixes a bug nor adds a feature
- `chore:` — Build process or tooling changes

## Code Style

- TypeScript strict mode
- No external dependencies in core
- All user-facing text must be sanitized (XSS safe)
- Keep bundle size minimal

## Reporting Issues

- Check existing issues first
- Include browser/OS info
- Provide a minimal reproduction if possible
