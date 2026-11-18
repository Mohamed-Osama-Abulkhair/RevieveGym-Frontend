import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-8 gap-3" [ngClass]="containerClass">
      <div class="w-10 h-10 border-4 border-slate-200 border-t-gym-300 rounded-full animate-spin"></div>
      @if (message) {
        <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{{ message }}</p>
      }
    </div>
  `,
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'جاري التحميل...';
  @Input() containerClass: string = '';
}
