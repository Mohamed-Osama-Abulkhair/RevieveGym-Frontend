import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration: number;
  isPaused?: boolean;
}

interface ToastTimerState {
  timer: any;
  startTime: number;
  remaining: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);
  private timerMap = new Map<string, ToastTimerState>();

  show(toast: {
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message?: string;
    duration?: number;
  }) {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = toast.duration || 4500;
    const newToast: ToastMessage = { ...toast, id, duration, isPaused: false };

    this.toasts.update((current) => [...current, newToast]);

    const timerState: ToastTimerState = {
      startTime: Date.now(),
      remaining: duration,
      timer: setTimeout(() => {
        this.remove(id);
      }, duration),
    };

    this.timerMap.set(id, timerState);
  }

  pause(id: string) {
    const state = this.timerMap.get(id);
    if (state && state.timer) {
      clearTimeout(state.timer);
      state.timer = null;
      const elapsed = Date.now() - state.startTime;
      state.remaining = Math.max(state.remaining - elapsed, 500);

      this.toasts.update((items) =>
        items.map((t) => (t.id === id ? { ...t, isPaused: true } : t))
      );
    }
  }

  resume(id: string) {
    const state = this.timerMap.get(id);
    if (state && !state.timer) {
      state.startTime = Date.now();
      state.timer = setTimeout(() => {
        this.remove(id);
      }, state.remaining);

      this.toasts.update((items) =>
        items.map((t) => (t.id === id ? { ...t, isPaused: false } : t))
      );
    }
  }

  remove(id: string) {
    const state = this.timerMap.get(id);
    if (state && state.timer) {
      clearTimeout(state.timer);
    }
    this.timerMap.delete(id);
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }

  success(title: string, message?: string) {
    this.show({ type: 'success', title, message });
  }

  error(title: string, message?: string) {
    this.show({ type: 'error', title, message });
  }

  info(title: string, message?: string) {
    this.show({ type: 'info', title, message });
  }

  warning(title: string, message?: string) {
    this.show({ type: 'warning', title, message });
  }
}
