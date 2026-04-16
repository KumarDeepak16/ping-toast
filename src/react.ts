import { useEffect, useRef } from 'react';
import { toast, configure, on } from './core';
import type {
  PingToasterProps,
  ToastEvent,
  ToastEventCallback,
} from './types';

export { toast, configure } from './core';
export type * from './types';

/**
 * <PingToaster /> — Drop-in setup component. One line.
 *
 * ```tsx
 * // Basic
 * <PingToaster position="top-right" theme="auto" />
 *
 * // With custom theme colors
 * <PingToaster
 *   position="top-right"
 *   background="#18181b"
 *   foreground="#fafafa"
 *   success="#22c55e"
 *   error="#ef4444"
 *   radius="12px"
 * />
 * ```
 */
export { PingToasterProps };

export function PingToaster(props: PingToasterProps): null {
  const {
    position, duration, maxVisible, theme,
    closable, progress, dedup,
    background, foreground, radius, font,
  } = props;

  // Serialize theme props to detect changes without object identity issues
  const themeKey = [background, foreground, radius, font].join('|');

  useEffect(() => {
    configure(props);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, duration, maxVisible, theme, closable, progress, dedup, themeKey]);

  return null;
}

/**
 * useToast() — hook for imperative toast calls.
 *
 * ```tsx
 * const { toast, success, error } = useToast()
 * success('Saved!')
 * ```
 */
export function useToast() {
  return {
    toast,
    success:    toast.success,
    error:      toast.error,
    warning:    toast.warning,
    info:       toast.info,
    loading:    toast.loading,
    promise:    toast.promise,
    update:     toast.update,
    dismiss:    toast.dismiss,
    dismissAll: toast.dismissAll,
    custom:     toast.custom,
    confirm:    toast.confirm,
    alert:      toast.alert,
  } as const;
}

/**
 * useToastListener(event, callback) — subscribe to toast lifecycle events.
 */
export function useToastListener(event: ToastEvent, fn: ToastEventCallback): void {
  const cb = useRef(fn);
  cb.current = fn;
  useEffect(() => {
    return on(event, data => cb.current(data));
  }, [event]);
}

export default toast;
