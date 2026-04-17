import { STYLES } from './styles';
import { ICONS } from './icons';
import type {
  ToastOptions,
  PingToasterProps,
  ToastState,
  ToastEvent,
  ToastEventCallback,
  PromiseMessages,
  Unsubscribe,
} from './types';

// ─── Internal config ───────────────────────────────────────────────────────────
interface InternalConfig {
  position: string;
  duration: number;
  maxVisible: number;
  theme: string;
  closable: boolean;
  progress: boolean;
  dedup: boolean;
  animation: string;
  gap: number;
  offset: number;
  // theme overrides — applied as inline styles so they always win
  background: string;
  foreground: string;
  radius: string;
  font: string;
}

const defaults: InternalConfig = {
  position: 'top-right',
  duration: 3500,
  maxVisible: 5,
  theme: 'auto',
  closable: true,
  progress: true,
  dedup: true,
  animation: 'slide',
  gap: 10,
  offset: 16,
  background: '',
  foreground: '',
  radius: '',
  font: '',
};

let cfg: InternalConfig = { ...defaults };
let toasts: ToastState[] = [];
let container: HTMLElement | null = null;
let listeners: Record<string, ToastEventCallback[]> = {};
let idCounter = 0;
let styleInjected = false;

// ─── Security ─────────────────────────────────────────────────────────────────
function escapeHTML(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function uid(): string {
  return `pt-${++idCounter}-${Date.now()}`;
}

function injectStyles(): void {
  if (styleInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.id = 'ping-toast-styles';
  el.textContent = STYLES;
  document.head.appendChild(el);
  styleInjected = true;
}

function resolveTheme(theme: string): string {
  if (theme !== 'auto') return theme;
  if (typeof matchMedia === 'undefined') return 'light';
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// When user picks theme:'auto', react to OS preference changes live.
let mqlListener: ((e: MediaQueryListEvent) => void) | null = null;
function syncAutoThemeListener(): void {
  if (typeof matchMedia === 'undefined') return;
  const mql = matchMedia('(prefers-color-scheme: dark)');
  if (mqlListener) {
    mql.removeEventListener?.('change', mqlListener);
    mqlListener = null;
  }
  if (cfg.theme === 'auto') {
    mqlListener = (e) => {
      if (cfg.theme !== 'auto' || !container) return;
      container.setAttribute('data-pt-theme', e.matches ? 'dark' : 'light');
    };
    mql.addEventListener?.('change', mqlListener);
  }
}

function getContainer(): HTMLElement {
  if (container && container.isConnected) return container;
  injectStyles();
  container = document.createElement('div');
  container.className = 'pt-c';
  container.setAttribute('data-pos', cfg.position);
  container.setAttribute('data-anim', cfg.animation);
  container.setAttribute('role', 'region');
  container.setAttribute('aria-label', 'Notifications');
  container.setAttribute('data-pt-theme', resolveTheme(cfg.theme));
  applyContainerLayout(container);
  document.body.appendChild(container);
  syncAutoThemeListener();
  return container;
}

// ─── Apply layout (gap/offset) as inline styles on container ──────────────────
function applyContainerLayout(c: HTMLElement): void {
  c.style.gap = `${cfg.gap}px`;
  c.style.padding = `${cfg.offset}px`;
}

function emit(event: string, data: ToastState): void {
  (listeners[event] || []).forEach(fn => fn(data));
}

// ─── Apply theme vars as inline styles on container ───────────────────────────
// Inline styles on the container mean the CSS custom properties are inherited
// by all children — no cascade specificity fights, no !important needed.
function applyContainerTheme(c: HTMLElement): void {
  const map: Array<[keyof InternalConfig, string]> = [
    ['background', '--pb'],
    ['foreground', '--pf'],
    ['radius',     '--pr'],
    ['font',       '--pfm'],
  ];
  for (const [key, cssVar] of map) {
    const val = cfg[key] as string;
    if (val) c.style.setProperty(cssVar, val);
    else c.style.removeProperty(cssVar);
  }
}

// Apply background/foreground/radius directly to a toast element as inline styles.
// This ensures even toasts that render before container vars propagate are styled.
function applyToastTheme(el: HTMLElement): void {
  if (cfg.background) el.style.background = cfg.background;
  else el.style.removeProperty('background');

  if (cfg.foreground) el.style.color = cfg.foreground;
  else el.style.removeProperty('color');

  if (cfg.radius) el.style.borderRadius = cfg.radius;
  else el.style.removeProperty('border-radius');
}

// ─── Configure — vanilla `configure()` merges with current config ─────────────
// (Merge semantics let vanilla users call `configure({ theme: 'dark' })` without
// wiping previously-set `background`, `radius`, etc.)
export function configure(props: PingToasterProps): void {
  applyConfig(props, cfg);
}

// ─── Internal — called by <PingToaster>. Each render REPLACES the config: any
// prop the user omits resets to the factory default. This matches React intuition
// ("what I pass is what I get") — omitting `position` returns to the default
// `top-right`, not whatever happened to be set previously.
export function _configureFromReact(props: PingToasterProps): void {
  applyConfig(props, defaults);
}

function applyConfig(props: PingToasterProps, base: InternalConfig): void {
  cfg = {
    position:   props.position   ?? base.position,
    duration:   props.duration   ?? base.duration,
    maxVisible: props.maxVisible ?? base.maxVisible,
    theme:      props.theme      ?? base.theme,
    closable:   props.closable   ?? base.closable,
    progress:   props.progress   ?? base.progress,
    dedup:      props.dedup      ?? base.dedup,
    animation:  props.animation  ?? base.animation,
    gap:        props.gap        ?? base.gap,
    offset:     props.offset     ?? base.offset,
    background: props.background ?? base.background,
    foreground: props.foreground ?? base.foreground,
    radius:     props.radius     ?? base.radius,
    font:       props.font       ?? base.font,
  };

  if (typeof document === 'undefined') return;

  const c = getContainer();
  c.setAttribute('data-pos', cfg.position);
  c.setAttribute('data-anim', cfg.animation);
  c.setAttribute('data-pt-theme', resolveTheme(cfg.theme));

  applyContainerLayout(c);
  applyContainerTheme(c);
  syncAutoThemeListener();

  // Re-apply to existing toasts
  c.querySelectorAll<HTMLElement>('.pt-t').forEach(el => applyToastTheme(el));
}

// ─── Swipe to dismiss ─────────────────────────────────────────────────────────
function attachSwipe(el: HTMLElement, id: string): () => void {
  let startX = 0;
  let dx = 0;
  let swiping = false;

  function onDown(e: MouseEvent | TouchEvent) {
    startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    swiping = true;
    el.classList.add('pt-sw');
  }
  function onMove(e: MouseEvent | TouchEvent) {
    if (!swiping) return;
    dx = ('touches' in e ? e.touches[0].clientX : e.clientX) - startX;
    el.style.transform = `translateX(${dx}px)`;
    el.style.opacity = String(Math.max(0, 1 - Math.abs(dx) / 180));
  }
  function onUp() {
    if (!swiping) return;
    swiping = false;
    el.classList.remove('pt-sw');
    if (Math.abs(dx) > 80) dismiss(id);
    else { el.style.transform = ''; el.style.opacity = ''; }
    dx = 0;
  }

  el.addEventListener('mousedown', onDown);
  el.addEventListener('touchstart', onDown, { passive: true });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('mouseup', onUp);
  window.addEventListener('touchend', onUp);

  return () => {
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('touchmove', onMove);
    window.removeEventListener('mouseup', onUp);
    window.removeEventListener('touchend', onUp);
  };
}

// ─── Build toast HTML ─────────────────────────────────────────────────────────
function buildToastHTML(t: ToastState): string {
  let iconHTML = '';
  if (t.type === 'loading') {
    iconHTML = `<div class="pt-ic"><div class="pt-sp"></div></div>`;
  } else if (t.icon !== undefined) {
    iconHTML = `<div class="pt-ic">${t.icon}</div>`;
  } else if (ICONS[t.type]) {
    iconHTML = `<div class="pt-ic">${ICONS[t.type]}</div>`;
  }

  const titleHTML = t.title ? `<div class="pt-tt">${escapeHTML(t.title)}</div>` : '';
  const descHTML  = t.description ? `<div class="pt-d">${escapeHTML(t.description)}</div>` : '';
  const msgHTML   = `<div class="pt-m">${escapeHTML(t.message)}</div>`;
  const actionHTML = t.action
    ? `<button type="button" class="pt-a" data-pt-action="true">${escapeHTML(t.action.label)}</button>`
    : '';
  const closeHTML = t.closable !== false && cfg.closable
    ? `<button type="button" class="pt-cl" aria-label="Dismiss">${ICONS.close}</button>`
    : '';
  const dur = t.duration !== undefined ? t.duration : cfg.duration;
  const progressHTML = t.progress !== false && cfg.progress && dur > 0 && t.type !== 'loading'
    ? `<div class="pt-pr" style="animation-duration:${dur}ms"></div>`
    : '';

  return `${iconHTML}<div class="pt-b">${titleHTML}${msgHTML}${descHTML}</div>${actionHTML}${closeHTML}${progressHTML}`;
}

// ─── FLIP: smoothly animate existing siblings when one is added/removed ──────
// Captures sibling rects BEFORE the DOM mutation, then after the mutation
// inverts them with a transform, and plays them back to the new position.
// This removes the "snap" when stacked toasts reflow.
function captureSiblingRects(c: HTMLElement): Map<HTMLElement, DOMRect> {
  const map = new Map<HTMLElement, DOMRect>();
  c.querySelectorAll<HTMLElement>('.pt-t').forEach(el => {
    if (!el.classList.contains('pt-x')) {
      map.set(el, el.getBoundingClientRect());
    }
  });
  return map;
}

function playSiblingFLIP(before: Map<HTMLElement, DOMRect>): void {
  before.forEach((oldRect, el) => {
    if (!el.isConnected) return;
    const newRect = el.getBoundingClientRect();
    const dy = oldRect.top - newRect.top;
    const dx = oldRect.left - newRect.left;
    if (Math.abs(dy) < 0.5 && Math.abs(dx) < 0.5) return;
    // Skip if element is mid-entrance (would fight its own transition)
    if (el.classList.contains('pt-e')) return;
    el.style.transition = 'none';
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    // Force reflow so the browser registers the start position
    el.getBoundingClientRect();
    el.style.transition = 'transform .4s cubic-bezier(.22,1,.36,1)';
    el.style.transform = '';
    const clear = () => {
      el.style.transition = '';
      el.removeEventListener('transitionend', clear);
    };
    el.addEventListener('transitionend', clear);
  });
}

// ─── Render ───────────────────────────────────────────────────────────────────
function renderToast(t: ToastState): ToastState {
  const c = getContainer();

  // Dedup — update the existing toast in place instead of dismiss+create.
  // This avoids the "old one collapses while new one enters" visual jank.
  if (cfg.dedup) {
    const dup = toasts.find(x => x.message === t.message && x.id !== t.id && !x._exiting);
    if (dup && dup._el) {
      // Extend its lifetime, add a subtle pulse, and drop the duplicate toast record
      const dupEl = dup._el;
      dupEl.classList.remove('pt-pl');
      // Reset the progress bar animation
      const prog = dupEl.querySelector<HTMLElement>('.pt-pr');
      if (prog) {
        prog.style.animation = 'none';
        void prog.offsetWidth;
        prog.style.animation = '';
      }
      // Force a reflow for pulse restart
      void dupEl.offsetWidth;
      dupEl.classList.add('pt-pl');
      scheduleRemoval(dup);
      // Remove the new toast record we just pushed; keep dup active
      toasts = toasts.filter(x => x.id !== t.id);
      emit('show', dup);
      return dup;
    }
  }

  // Enforce maxVisible — oldest exits first
  const visible = toasts.filter(x => !x._exiting && x.id !== t.id);
  while (visible.length >= cfg.maxVisible) {
    const oldest = visible.shift();
    if (oldest) dismiss(oldest.id);
  }

  // Capture sibling positions BEFORE insertion for FLIP
  const before = captureSiblingRects(c);

  const el = document.createElement('div');
  el.className = 'pt-t pt-e';
  if (t.className) el.className += ` ${t.className}`;
  el.setAttribute('data-id', t.id);
  el.setAttribute('data-type', t.type || 'default');
  const isUrgent = t.type === 'error' || t.type === 'warning';
  el.setAttribute('role', isUrgent ? 'alert' : 'status');
  el.setAttribute('aria-live', isUrgent ? 'assertive' : 'polite');
  if (t.style) Object.assign(el.style, t.style);

  if (t.custom) {
    el.innerHTML = typeof t.custom === 'function' ? t.custom(t) : t.custom;
  } else {
    el.innerHTML = buildToastHTML(t);
  }

  t._el = el;
  c.appendChild(el);

  // Apply theme overrides directly — these always win
  applyToastTheme(el);

  // Play FLIP on siblings so they ease into their new stack position
  playSiblingFLIP(before);

  // Force reflow so the entering transform is committed before we remove it
  el.getBoundingClientRect();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.remove('pt-e');
      el.classList.add('pt-v');
    });
  });

  const closeBtn = el.querySelector('.pt-cl');
  if (closeBtn) closeBtn.addEventListener('click', () => dismiss(t.id));

  const actionBtn = el.querySelector('[data-pt-action]');
  if (actionBtn && t.action) {
    const action = t.action;
    actionBtn.addEventListener('click', () => action.onClick(t.id));
  }

  t._cleanupSwipe = attachSwipe(el, t.id);

  if (t.duration !== 0 && cfg.duration !== 0 && t.type !== 'loading') {
    const progress = el.querySelector('.pt-pr') as HTMLElement | null;
    el.addEventListener('mouseenter', () => {
      clearTimeout(t._timer);
      if (progress) progress.style.animationPlayState = 'paused';
    });
    el.addEventListener('mouseleave', () => {
      scheduleRemoval(t);
      if (progress) progress.style.animationPlayState = 'running';
    });
    scheduleRemoval(t);
  }

  emit('show', t);
  return t;
}

function scheduleRemoval(t: ToastState): void {
  const dur = t.duration !== undefined ? t.duration : cfg.duration;
  if (dur <= 0 || t.type === 'loading') return;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => dismiss(t.id), dur);
}

// ─── Core API ─────────────────────────────────────────────────────────────────
function createToast(message: string, options: ToastOptions = {}): string {
  const t: ToastState = {
    id: options.id || uid(),
    message,
    type: options.type || 'default',
    ...options,
    _exiting: false,
  };

  const idx = toasts.findIndex(x => x.id === t.id);
  if (idx !== -1) {
    dismissImmediate(toasts[idx]);
    toasts.splice(idx, 1);
  }

  toasts.push(t);
  if (typeof document !== 'undefined') renderToast(t);
  return t.id;
}

export function dismiss(id: string): void {
  const t = toasts.find(x => x.id === id);
  if (!t || t._exiting) return;
  t._exiting = true;
  clearTimeout(t._timer);
  t._cleanupSwipe?.();
  if (t._el) {
    const el = t._el;
    const c = el.parentElement;
    // Capture siblings BEFORE we mark exiting — so FLIP baseline has the
    // exiting toast's height included, and siblings can smoothly shift up.
    const before = c ? captureSiblingRects(c) : null;
    el.classList.add('pt-x');
    // After marking exiting, siblings re-layout; play FLIP on them.
    if (before && c) {
      // Skip the exiting toast itself
      before.delete(el);
      // Run after the exit transition begins so new rects reflect the collapse
      requestAnimationFrame(() => playSiblingFLIP(before));
    }
    let finalized = false;
    const finalize = () => {
      if (finalized) return;
      finalized = true;
      el.remove();
      toasts = toasts.filter(x => x.id !== id);
      emit('dismiss', t);
    };
    el.addEventListener('transitionend', finalize, { once: true });
    // Safety net in case transitionend doesn't fire (reduced motion, etc.)
    setTimeout(finalize, 500);
  } else {
    toasts = toasts.filter(x => x.id !== id);
    emit('dismiss', t);
  }
}

function dismissImmediate(t: ToastState): void {
  clearTimeout(t._timer);
  t._cleanupSwipe?.();
  t._el?.remove();
}

export function dismissAll(): void {
  [...toasts].forEach(t => dismiss(t.id));
}

export function update(id: string, options: Partial<ToastOptions> & { message?: string }): void {
  const t = toasts.find(x => x.id === id);
  if (!t) return;
  Object.assign(t, options);

  if (t._el) {
    const el = document.createElement('div');
    el.className = 'pt-t pt-v';
    if (t.className) el.className += ` ${t.className}`;
    el.setAttribute('data-id', t.id);
    el.setAttribute('data-type', t.type || 'default');
    const isUrgent = t.type === 'error' || t.type === 'warning';
    el.setAttribute('role', isUrgent ? 'alert' : 'status');
    el.setAttribute('aria-live', isUrgent ? 'assertive' : 'polite');
    if (t.style) Object.assign(el.style, t.style);
    el.innerHTML = buildToastHTML(t);
    t._el.parentNode?.replaceChild(el, t._el);
    t._el = el;

    applyToastTheme(el);

    const closeBtn = el.querySelector('.pt-cl');
    if (closeBtn) closeBtn.addEventListener('click', () => dismiss(t.id));

    const actionBtn = el.querySelector('[data-pt-action]');
    if (actionBtn && t.action) {
      const action = t.action;
      actionBtn.addEventListener('click', () => action.onClick(t.id));
    }

    t._cleanupSwipe?.();
    t._cleanupSwipe = attachSwipe(el, t.id);

    const dur = t.duration !== undefined ? t.duration : cfg.duration;
    if (t.type !== 'loading' && dur > 0) scheduleRemoval(t);
  }
  emit('update', t);
}

// ─── Promise API ──────────────────────────────────────────────────────────────
export function toastPromise<T>(promise: Promise<T>, messages: PromiseMessages<T> = {}): string {
  const id = createToast(messages.loading || 'Loading...', { type: 'loading', duration: 0, id: uid() });
  Promise.resolve(promise).then(
    result => {
      const msg = typeof messages.success === 'function' ? messages.success(result) : messages.success || 'Done!';
      update(id, { type: 'success', message: msg, duration: cfg.duration });
      const t = toasts.find(x => x.id === id);
      if (t) scheduleRemoval(t);
    },
    err => {
      const msg = typeof messages.error === 'function' ? messages.error(err) : messages.error || 'Something went wrong';
      update(id, { type: 'error', message: msg, duration: cfg.duration });
      const t = toasts.find(x => x.id === id);
      if (t) scheduleRemoval(t);
    }
  );
  return id;
}

// ─── Events ───────────────────────────────────────────────────────────────────
export function on(event: ToastEvent, fn: ToastEventCallback): Unsubscribe {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(fn);
  return () => {
    listeners[event] = listeners[event].filter(x => x !== fn);
  };
}

// ─── Public toast function ────────────────────────────────────────────────────
export function toast(message: string, options: ToastOptions = {}): string {
  return createToast(message, options);
}

toast.success    = (msg: string, opts: ToastOptions = {}) => createToast(msg, { ...opts, type: 'success' });
toast.error      = (msg: string, opts: ToastOptions = {}) => createToast(msg, { ...opts, type: 'error' });
toast.warning    = (msg: string, opts: ToastOptions = {}) => createToast(msg, { ...opts, type: 'warning' });
toast.info       = (msg: string, opts: ToastOptions = {}) => createToast(msg, { ...opts, type: 'info' });
toast.loading    = (msg: string, opts: ToastOptions = {}) => createToast(msg, { ...opts, type: 'loading', duration: 0 });
toast.promise    = toastPromise;
toast.update     = update;
toast.dismiss    = dismiss;
toast.dismissAll = dismissAll;
toast.custom     = (render: string | ((t: ToastState) => string), opts: ToastOptions = {}) => createToast('', { ...opts, custom: render });
toast.on         = on;

// ─── Confirm / Alert ──────────────────────────────────────────────────────────
toast.confirm = (message: string, opts: { confirm?: string; cancel?: string } = {}): Promise<boolean> => {
  return new Promise<boolean>(resolve => {
    const id = createToast('', {
      duration: 0, closable: false, progress: false,
      custom: () =>
        `<div class="pt-dl"><div class="pt-dm">${escapeHTML(message)}</div>` +
        `<div class="pt-db"><button class="pt-bt pt-bc">${escapeHTML(opts.cancel || 'Cancel')}</button>` +
        `<button class="pt-bt pt-bo">${escapeHTML(opts.confirm || 'Confirm')}</button></div></div>`,
    });
    requestAnimationFrame(() => {
      const t = toasts.find(x => x.id === id);
      if (t?._el) {
        t._el.querySelector('.pt-bo')?.addEventListener('click', () => { dismiss(id); resolve(true); });
        t._el.querySelector('.pt-bc')?.addEventListener('click', () => { dismiss(id); resolve(false); });
      }
    });
  });
};

toast.alert = (message: string, opts: { buttonLabel?: string } = {}): Promise<void> => {
  return new Promise<void>(resolve => {
    const id = createToast('', {
      duration: 0, closable: false, progress: false,
      custom: () =>
        `<div class="pt-dl"><div class="pt-dm">${escapeHTML(message)}</div>` +
        `<div class="pt-db"><button class="pt-bt pt-bo">${escapeHTML(opts.buttonLabel || 'OK')}</button></div></div>`,
    });
    requestAnimationFrame(() => {
      const t = toasts.find(x => x.id === id);
      if (t?._el) {
        t._el.querySelector('.pt-bo')?.addEventListener('click', () => { dismiss(id); resolve(); });
      }
    });
  });
};
