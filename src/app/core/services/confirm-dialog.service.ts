import { Injectable, signal } from '@angular/core';

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  isOpen = signal<boolean>(false);
  options = signal<ConfirmDialogOptions>({
    title: '',
    message: '',
  });

  private resolvePromise?: (result: boolean) => void;

  confirm(options: ConfirmDialogOptions): Promise<boolean> {
    this.options.set(options);
    this.isOpen.set(true);

    return new Promise<boolean>((resolve) => {
      this.resolvePromise = resolve;
    });
  }

  handleConfirm(): void {
    this.isOpen.set(false);
    if (this.resolvePromise) {
      this.resolvePromise(true);
    }
  }

  handleCancel(): void {
    this.isOpen.set(false);
    if (this.resolvePromise) {
      this.resolvePromise(false);
    }
  }
}
