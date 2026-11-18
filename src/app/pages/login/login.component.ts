import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  identifier = '';
  password = '';
  isLoading = signal<boolean>(false);

  onSubmit(): void {
    if (!this.identifier.trim() || !this.password.trim()) {
      this.toast.warning('تنبيه', 'يرجى إدخال رقم الهاتف/الكود وكلمة المرور');
      return;
    }

    this.isLoading.set(true);
    this.authService
      .login({ identifier: this.identifier.trim(), password: this.password })
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.toast.success('مرحباً بك', `تم تسجيل الدخول بنجاح، أهلاً بك يا ${res.user.displayName}`);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.toast.error('خطأ في تسجيل الدخول', err.message || 'بيانات الدخول غير صحيحة');
        },
      });
  }
}
