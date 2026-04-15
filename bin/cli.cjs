#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SKILL = `# PingToast — AI Agent Skill

Use ping-toast when adding toast notifications, alerts,
confirmations, or notification popups to any project.

## Install
npm install ping-toast

## Vanilla JS
import { toast, createToaster } from 'ping-toast'
createToaster({ position: 'top-right', theme: 'auto' })

## React
import { PingToaster } from 'ping-toast/react'
<PingToaster position="top-right" theme="auto" />

import { useToast } from 'ping-toast/react'
const { success, error, confirm } = useToast()

## API
toast('msg')           toast.success('msg')
toast.error('msg')     toast.warning('msg')
toast.info('msg')      toast.loading('msg')

toast.promise(promise, { loading, success, error })
toast.confirm('Delete?', { confirm: 'Yes', cancel: 'No' })
toast.alert('Session expired')
toast.dismiss(id)      toast.dismissAll()
toast.update(id, opts) toast.custom(renderFn)
toast.on('show', fn)

## Options
{ title, description, duration, action: { label, onClick },
  closable, progress, icon, className, style }

## Config
{ position, duration, maxVisible, theme, closable,
  progress, dedup }

## Theme (config prop or setTheme)
{ success, error, warning, info, background,
  foreground, radius, font }
`;

const cmd = process.argv[2];

if (cmd === 'init') {
  const dest = path.join(process.cwd(), 'pingtoasterskill.md');

  if (fs.existsSync(dest)) {
    console.log('\\x1b[33m⚠\\x1b[0m  pingtoasterskill.md already exists');
    process.exit(0);
  }

  fs.writeFileSync(dest, SKILL);
  console.log('\\x1b[32m✓\\x1b[0m  Created pingtoasterskill.md');
  console.log('  AI agents will now use PingToast for notifications.');
} else {
  console.log('');
  console.log('  \\x1b[1mping-toast\\x1b[0m — Ultra-lightweight toast notifications');
  console.log('');
  console.log('  \\x1b[2mUsage:\\x1b[0m');
  console.log('    npx ping-toast init    Create AI agent skill file');
  console.log('');
  console.log('  \\x1b[2mDocs:\\x1b[0m  https://pingtoast.1619.in');
  console.log('  \\x1b[2mnpm:\\x1b[0m   https://npmjs.com/package/ping-toast');
  console.log('');
}
