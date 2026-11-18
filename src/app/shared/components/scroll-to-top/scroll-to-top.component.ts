import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible()) {
      <button
        (click)="scrollToTop()"
        class="fixed bottom-6 right-6 z-50 w-11 h-11 bg-gym-300 text-white rounded-xl shadow-lg hover:bg-gym-400 flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95"
        title="الرجوع للأعلى"
      >
        <i class="fa-solid fa-arrow-up"></i>
      </button>
    }
  `,
})
export class ScrollToTopComponent {
  isVisible = signal<boolean>(false);

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isVisible.set(window.scrollY > 300);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
