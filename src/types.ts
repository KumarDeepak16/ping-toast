export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export type ThemeMode = 'light' | 'dark' | 'auto';
export type ToastEvent = 'show' | 'dismiss' | 'update';

export interface ToastAction {
  label: string;
  onClick: (id: string) => void;
}

export interface ToastOptions {
  id?: string;
  type?: ToastType;
  title?: string;
  description?: string;
  icon?: string;
  duration?: number;
  closable?: boolean;
  progress?: boolean;
  action?: ToastAction;
  style?: Partial<CSSStyleDeclaration>;
  className?: string;
  custom?: string | ((toast: ToastState) => string);
}

/** Props for <PingToaster /> — the single setup component */
export interface PingToasterProps {
  position?: ToastPosition;
  duration?: number;
  maxVisible?: number;
  theme?: ThemeMode;
  closable?: boolean;
  progress?: boolean;
  dedup?: boolean;
  /** Override toast background color (hex or any CSS color) */
  background?: string;
  /** Override toast text color (hex or any CSS color) */
  foreground?: string;
  /** Override border-radius e.g. "8px" or "999px" */
  radius?: string;
  /** Override font-family */
  font?: string;
}

export interface ToastState extends Required<Pick<ToastOptions, 'type'>> {
  id: string;
  message: string;
  title?: string;
  description?: string;
  icon?: string;
  duration?: number;
  closable?: boolean;
  progress?: boolean;
  action?: ToastAction;
  style?: Partial<CSSStyleDeclaration>;
  className?: string;
  custom?: string | ((toast: ToastState) => string);
  /** @internal */
  _el?: HTMLElement;
  /** @internal */
  _timer?: ReturnType<typeof setTimeout>;
  /** @internal */
  _exiting?: boolean;
  /** @internal */
  _cleanupSwipe?: () => void;
}

export type ToastEventCallback = (toast: ToastState) => void;
export type Unsubscribe = () => void;

export interface PromiseMessages<T = unknown> {
  loading?: string;
  success?: string | ((data: T) => string);
  error?: string | ((err: unknown) => string);
}

export interface ToastFunction {
  (message: string, options?: ToastOptions): string;
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  loading: (message: string, options?: ToastOptions) => string;
  promise: <T>(promise: Promise<T>, messages?: PromiseMessages<T>) => string;
  update: (id: string, options: Partial<ToastOptions> & { message?: string }) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  custom: (render: string | ((toast: ToastState) => string), options?: ToastOptions) => string;
  on: (event: ToastEvent, callback: ToastEventCallback) => Unsubscribe;
  confirm: (message: string, opts?: { confirm?: string; cancel?: string }) => Promise<boolean>;
  alert: (message: string, opts?: { buttonLabel?: string }) => Promise<void>;
}
