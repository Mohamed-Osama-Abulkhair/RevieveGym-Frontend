import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-brandSurface-dark py-6 transition-colors">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">
          جميع الحقوق محفوظة &copy; {{ currentYear }} - <span class="font-bold text-gym-300">Revieve Gym</span>
        </p>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
