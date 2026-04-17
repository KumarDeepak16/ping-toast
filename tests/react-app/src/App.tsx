import { useState } from 'react'
import { PingToaster, toast } from 'ping-toast/react'
import type { PingToasterProps } from 'ping-toast/react'

type Position = NonNullable<PingToasterProps['position']>
type ThemeMode = NonNullable<PingToasterProps['theme']>
type Animation = NonNullable<PingToasterProps['animation']>

const POSITIONS: Position[] = [
  'top-left','top-center','top-right',
  'bottom-left','bottom-center','bottom-right'
]
const THEMES: ThemeMode[] = ['auto','light','dark']
const ANIMS: Animation[] = ['slide','fade','scale','bounce','flip']

export default function App() {
  const [position, setPosition] = useState<Position>('top-right')
  const [theme, setTheme] = useState<ThemeMode>('auto')
  const [animation, setAnimation] = useState<Animation>('slide')
  const [duration, setDuration] = useState(3500)
  const [bg, setBg] = useState('')
  const [fg, setFg] = useState('')
  const [radius, setRadius] = useState('')
  const [twoInstances, setTwoInstances] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 text-zinc-800 dark:text-zinc-100 p-6">

      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            PingToast Playground
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Tweak settings and instantly preview toast behavior.
          </p>
        </div>

        {/* Code Preview */}
        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 shadow-sm">
          <pre className="text-xs overflow-x-auto text-zinc-700 dark:text-zinc-300">
{`<PingToaster
  position="${position}"
  theme="${theme}"
  animation="${animation}"
  duration={${duration}}${bg ? `\n  background="${bg}"` : ''}${fg ? `\n  foreground="${fg}"` : ''}${radius ? `\n  radius="${radius}"` : ''}
/>`}
          </pre>
        </div>

        {/* Controls */}
        <Card title="Position">
          {POSITIONS.map(p => (
            <Btn key={p} active={position === p} onClick={() => setPosition(p)}>
              {p}
            </Btn>
          ))}
        </Card>

        <Card title="Theme">
          {THEMES.map(t => (
            <Btn key={t} active={theme === t} onClick={() => setTheme(t)}>
              {t}
            </Btn>
          ))}
        </Card>

        <Card title="Animation">
          {ANIMS.map(a => (
            <Btn key={a} active={animation === a} onClick={() => setAnimation(a)}>
              {a}
            </Btn>
          ))}
        </Card>

        <Card title="Duration">
          {[1500, 3500, 8000].map(d => (
            <Btn key={d} active={duration === d} onClick={() => setDuration(d)}>
              {d}ms
            </Btn>
          ))}
        </Card>

        <Card title="Theme Overrides">
          <Btn onClick={() => { setBg('#18181b'); setFg('#fafafa') }}>
            Dark Mode
          </Btn>
          <Btn onClick={() => setRadius('20px')}>
            Rounded
          </Btn>
          <Btn onClick={() => { setBg(''); setFg(''); setRadius('') }}>
            Reset
          </Btn>
        </Card>

        <Card title="Edge Cases">
          <Btn active={twoInstances} onClick={() => setTwoInstances(v => !v)}>
            {twoInstances ? 'Remove 2nd Toaster' : 'Add 2nd Toaster'}
          </Btn>
        </Card>

        {/* Actions */}
        <Card title="Fire Toast">
          <Btn onClick={() => toast('Default toast')}>Default</Btn>
          <Btn onClick={() => toast.success('Saved!')}>Success</Btn>
          <Btn onClick={() => toast.error('Failed')}>Error</Btn>
          <Btn onClick={() => toast.warning('Careful')}>Warning</Btn>
          <Btn onClick={() => toast.info('FYI')}>Info</Btn>
          <Btn onClick={() => toast.loading('Loading…')}>Loading</Btn>
        </Card>

        <Card title="Dismiss">
          <Btn onClick={() => toast.dismissAll()}>
            Clear All
          </Btn>
        </Card>

      </div>

      {/* Toaster */}
      <PingToaster
        position={position}
        theme={theme}
        animation={animation}
        duration={duration}
        background={bg || undefined}
        foreground={fg || undefined}
        radius={radius || undefined}
      />

      {twoInstances && <PingToaster position="top-left" theme="dark" />}
    </div>
  )
}

/* ---------- UI Components ---------- */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 shadow-sm">
      <h2 className="text-xs uppercase tracking-wider text-zinc-500 mb-3">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  )
}

function Btn({
  active,
  children,
  onClick
}: {
  active?: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 text-sm rounded-full border transition-all
        ${active
          ? 'bg-indigo-600 text-white border-indigo-600 shadow'
          : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700'
        }
      `}
    >
      {children}
    </button>
  )
}
