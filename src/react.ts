import { useEffect, useLayoutEffect, useRef } from 'react';
import { toast, configure, on } from './core';
import type {
  PingToasterProps,
  ToastEvent,
  ToastEventCallback,
} from './types';

export { toast, configure } from './core';
export type * from './types';

// useLayoutEffect on client, useEffect on server — avoids SSR warning and
// ensures config applies BEFORE the first paint on the client.
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * <PingToaster /> — Drop-in setup component. One line.
 *
 * ```tsx
 * // Basic
 * <PingToaster position="top-right" theme="auto" />
 *
 * // With animation + custom theme
 * <PingToaster
 *   position="top-right"
 *   animation="bounce"
 *   theme="dark"
 *   background="#18181b"
 *   foreground="#fafafa"
 *   radius="12px"
 * />
 * ```
 */
export { PingToasterProps };

export function PingToaster(props: PingToasterProps): null {
  const {
    position, duration, maxVisible, theme,
    closable, progress, dedup,
    animation, gap, offset,
    background, foreground, radius, font,
  } = props;

  // Serialize theme props to detect changes without object identity issues
  const themeKey = [background, foreground, radius, font].join('|');

  useIsoLayoutEffect(() => {
    configure(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    position, duration, maxVisible, theme,
    closable, progress, dedup,
    animation, gap, offset,
    themeKey,
  ]);

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
