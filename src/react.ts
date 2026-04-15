import { useEffect, useRef } from 'react';
import { toast, createToaster, setTheme, applyTheme } from './core';
import type {
  ToasterConfig,
  ThemeVars,
  ThemeMode,
  ToastPosition,
  ToastEvent,
  ToastEventCallback,
} from './types';

export { toast, setTheme, applyTheme } from './core';
export type * from './types';

/**
 * <PingToaster /> — Drop-in JSX component. One line setup.
 *
 * ```tsx
 * <PingToaster
 *   position="top-right"
 *   theme="auto"
 *   duration={3500}
 *   config={{ success: '#22c55e', error: '#ef4444', radius: '16px' }}
 * />
 * ```
 */
export interface PingToasterProps {
  position?: ToastPosition;
  duration?: number;
  maxVisible?: number;
  theme?: ThemeMode;
  closable?: boolean;
  progress?: boolean;
  dedup?: boolean;
  /** Custom theme colors — pass CSS variable overrides here */
  config?: ThemeVars;
}

export function PingToaster({
  position,
  duration,
  maxVisible,
  theme,
  closable,
  progress,
  dedup,
  config,
}: PingToasterProps): null {
  // Apply config on mount and whenever props change
  useEffect(() => {
    const opts: ToasterConfig = {};
    if (position !== undefined) opts.position = position;
    if (duration !== undefined) opts.duration = duration;
    if (maxVisible !== undefined) opts.maxVisible = maxVisible;
    if (theme !== undefined) opts.theme = theme;
    if (closable !== undefined) opts.closable = closable;
    if (progress !== undefined) opts.progress = progress;
    if (dedup !== undefined) opts.dedup = dedup;
    createToaster(opts);
    if (theme) applyTheme(theme);
  }, [position, duration, maxVisible, theme, closable, progress, dedup]);

  // Apply custom colors when config changes
  useEffect(() => {
    if (config) setTheme(config);
  }, [config]);

  return null;
}

/**
 * useToast() — hook for imperative toast calls.
 */
export function useToast() {
  return {
    toast,
    success: toast.success,
    error: toast.error,
    warning: toast.warning,
    info: toast.info,
    loading: toast.loading,
    promise: toast.promise,
    update: toast.update,
    dismiss: toast.dismiss,
    dismissAll: toast.dismissAll,
    custom: toast.custom,
    confirm: toast.confirm,
    alert: toast.alert,
  } as const;
}

/**
 * useToastListener(event, callback) — subscribe to toast events.
 */
export function useToastListener(event: ToastEvent, fn: ToastEventCallback): void {
  const cb = useRef(fn);
  cb.current = fn;
  useEffect(() => {
    return toast.on(event, (data) => cb.current(data));
  }, [event]);
}

export default toast;
