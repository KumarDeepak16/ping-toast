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

function getContainer(): HTMLElement {
  if (container && container.isConnected) return container;
  injectStyles();
  container = document.createElement('div');
  container.className = 'pt-container';
  container.setAttribute('data-pos', cfg.position);
  container.setAttribute('role', 'region');
  container.setAttribute('aria-label', 'Notifications');
  if (cfg.theme !== 'auto') container.setAttribute('data-pt-theme', cfg.theme);
  document.body.appendChild(container);
  return container;
}

function emit(event: string, data: ToastState): void {
  (listeners[event] || []).forEach(fn => fn(data));
}

// ─── Apply theme vars as inline styles on container ───────────────────────────
// Inline styles on the container mean the CSS custom properties are inherited
// by all children — no cascade specificity fights, no !important needed.
function applyContainerTheme(c: HTMLElement): void {
  const map: Array<[keyof InternalConfig, string]> = [
    ['background', '--pt-bg'],
    ['foreground', '--pt-fg'],
    ['radius',     '--pt-radius'],
    ['font',       '--pt-font'],
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

// ─── Internal configure — called by PingToaster ───────────────────────────────
export function configure(props: PingToasterProps): void {
  cfg = {
    position:   props.position   ?? cfg.position,
    duration:   props.duration   ?? cfg.duration,
    maxVisible: props.maxVisible ?? cfg.maxVisible,
    theme:      props.theme      ?? cfg.theme,
    closable:   props.closable   ?? cfg.closable,
    progress:   props.progress   ?? cfg.progress,
    dedup:      props.dedup      ?? cfg.dedup,
    background: props.background ?? '',
    foreground: props.foreground ?? '',
    radius:     props.radius     ?? '',
    font:       props.font       ?? '',
  };

  if (typeof document === 'undefined') return;

  const c = getContainer();
  c.setAttribute('data-pos', cfg.position);
  if (cfg.theme === 'auto') c.removeAttribute('data-pt-theme');
  else c.setAttribute('data-pt-theme', cfg.theme);

  applyContainerTheme(c);

  // Re-apply to existing toasts
  c.querySelectorAll<HTMLElement>('.pt-toast').forEach(el => applyToastTheme(el));
}

// ─── Swipe to dismiss ─────────────────────────────────────────────────────────
function attachSwipe(el: HTMLElement, id: string): () => void {
  let startX = 0;
  let dx = 0;
  let swiping = false;

  function onDown(e: MouseEvent | TouchEvent) {
    startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    swiping = true;
    el.classList.add('pt-toast--swiping');
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
    el.classList.remove('pt-toast--swiping');
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
    iconHTML = `<div class="pt-icon"><div class="pt-spinner"></div></div>`;
  } else if (t.icon !== undefined) {
    iconHTML = `<div class="pt-icon">${t.icon}</div>`;
  } else if (ICONS[t.type]) {
    iconHTML = `<div class="pt-icon">${ICONS[t.type]}</div>`;
  }

  const titleHTML = t.title ? `<div class="pt-title">${escapeHTML(t.title)}</div>` : '';
  const descHTML  = t.description ? `<div class="pt-desc">${escapeHTML(t.description)}</div>` : '';
  const msgHTML   = `<div class="pt-message">${escapeHTML(t.message)}</div>`;
  const actionHTML = t.action
    ? `<button type="button" class="pt-action" data-pt-action="true">${escapeHTML(t.action.label)}</button>`
    : '';
  const closeHTML = t.closable !== false && cfg.closable
    ? `<button type="button" class="pt-close" aria-label="Dismiss">${ICONS.close}</button>`
    : '';
  const dur = t.duration !== undefined ? t.duration : cfg.duration;
  const progressHTML = t.progress !== false && cfg.progress && dur > 0 && t.type !== 'loading'
    ? `<div class="pt-progress" style="animation-duration:${dur}ms"></div>`
    : '';

  return `${iconHTML}<div class="pt-body">${titleHTML}${msgHTML}${descHTML}</div>${actionHTML}${closeHTML}${progressHTML}`;
}

// ─── Render ───────────────────────────────────────────────────────────────────
function renderToast(t: ToastState): ToastState {
  const c = getContainer();

  if (cfg.dedup) {
    const dup = toasts.find(x => x.message === t.message && x.id !== t.id && !x._exiting);
    if (dup) dismiss(dup.id);
  }

  const visible = toasts.filter(x => !x._exiting);
  if (visible.length > cfg.maxVisible) dismiss(visible[0].id);

  const el = document.createElement('div');
  el.className = 'pt-toast pt-toast--entering';
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

  el.getBoundingClientRect();
  requestAnimationFrame(() => {
    el.classList.remove('pt-toast--entering');
    el.classList.add('pt-toast--visible');
  });

  const closeBtn = el.querySelector('.pt-close');
  if (closeBtn) closeBtn.addEventListener('click', () => dismiss(t.id));

  const actionBtn = el.querySelector('[data-pt-action]');
  if (actionBtn && t.action) {
    const action = t.action;
    actionBtn.addEventListener('click', () => action.onClick(t.id));
  }

  t._cleanupSwipe = attachSwipe(el, t.id);

  if (t.duration !== 0 && cfg.duration !== 0 && t.type !== 'loading') {
    const progress = el.querySelector('.pt-progress') as HTMLElement | null;
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
    t._el.classList.add('pt-toast--exiting');
    t._el.addEventListener('transitionend', () => {
      t._el?.remove();
      toasts = toasts.filter(x => x.id !== id);
      emit('dismiss', t);
    }, { once: true });
    setTimeout(() => {
      t._el?.remove();
      toasts = toasts.filter(x => x.id !== id);
    }, 400);
  } else {
    toasts = toasts.filter(x => x.id !== id);
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
    el.className = 'pt-toast pt-toast--visible';
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

    const closeBtn = el.querySelector('.pt-close');
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
  const confirmLabel = opts.confirm || 'Confirm';
  const cancelLabel  = opts.cancel  || 'Cancel';
  return new Promise<boolean>(resolve => {
    const id = createToast('', {
      duration: 0, closable: false, progress: false,
      custom: () => `
        <div style="padding:16px 20px;width:100%">
          <div style="font-weight:600;font-size:14px;margin-bottom:4px;color:var(--pt-fg)">${escapeHTML(message)}</div>
          <div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end">
            <button class="pt-confirm-cancel" style="padding:6px 16px;border-radius:8px;border:1px solid var(--pt-border);background:transparent;color:var(--pt-fg);font-size:13px;font-weight:500;cursor:pointer;font-family:var(--pt-font)">${escapeHTML(cancelLabel)}</button>
            <button class="pt-confirm-ok" style="padding:6px 16px;border-radius:8px;border:none;background:var(--pt-fg);color:var(--pt-bg);font-size:13px;font-weight:500;cursor:pointer;font-family:var(--pt-font)">${escapeHTML(confirmLabel)}</button>
          </div>
        </div>`,
    });
    requestAnimationFrame(() => {
      const t = toasts.find(x => x.id === id);
      if (t?._el) {
        t._el.querySelector('.pt-confirm-ok')?.addEventListener('click', () => { dismiss(id); resolve(true); });
        t._el.querySelector('.pt-confirm-cancel')?.addEventListener('click', () => { dismiss(id); resolve(false); });
      }
    });
  });
};

toast.alert = (message: string, opts: { buttonLabel?: string } = {}): Promise<void> => {
  const label = opts.buttonLabel || 'OK';
  return new Promise<void>(resolve => {
    const id = createToast('', {
      duration: 0, closable: false, progress: false,
      custom: () => `
        <div style="padding:16px 20px;width:100%">
          <div style="font-weight:600;font-size:14px;color:var(--pt-fg)">${escapeHTML(message)}</div>
          <div style="display:flex;justify-content:flex-end;margin-top:12px">
            <button class="pt-alert-ok" style="padding:6px 16px;border-radius:8px;border:none;background:var(--pt-fg);color:var(--pt-bg);font-size:13px;font-weight:500;cursor:pointer;font-family:var(--pt-font)">${escapeHTML(label)}</button>
          </div>
        </div>`,
    });
    requestAnimationFrame(() => {
      const t = toasts.find(x => x.id === id);
      if (t?._el) {
        t._el.querySelector('.pt-alert-ok')?.addEventListener('click', () => { dismiss(id); resolve(); });
      }
    });
  });
};
