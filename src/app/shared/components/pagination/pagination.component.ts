import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (totalPages > 1) {
      <div class="flex items-center justify-center gap-2 mt-6">
        <button
          [disabled]="currentPage <= 1"
          (click)="pageChange.emit(currentPage - 1)"
          class="btn-secondary !p-2 disabled:opacity-40 disabled:cursor-not-allowed"
          title="الصفحة السابقة"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>

        <span class="px-4 py-2 text-sm font-bold bg-white dark:bg-brandSurface-cardDark border border-slate-200 dark:border-slate-800 rounded-xl">
          صفحة {{ currentPage }} من {{ totalPages }}
        </span>

        <button
          [disabled]="currentPage >= totalPages"
          (click)="pageChange.emit(currentPage + 1)"
          class="btn-secondary !p-2 disabled:opacity-40 disabled:cursor-not-allowed"
          title="الصفحة التالية"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>
      </div>
    }
  `,
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();
}
