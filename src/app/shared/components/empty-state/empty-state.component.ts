import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-12 text-center">
      <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-brandSurface-cardDark flex items-center justify-center text-slate-400 mb-4">
        <i class="fa-solid text-3xl" [ngClass]="icon"></i>
      </div>
      <h3 class="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">{{ title }}</h3>
      @if (description) {
        <p class="text-sm text-slate-500 dark:text-slate-400 max-w-sm">{{ description }}</p>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() icon: string = 'fa-folder-open';
  @Input() title: string = 'لا توجد بيانات متاحة';
  @Input() description?: string;
}
