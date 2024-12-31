import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Kiểm tra nếu đang chạy trên môi trường trình duyệt (client)
  if (typeof window !== 'undefined' && window.localStorage) {
    const token = localStorage.getItem('user_token');
    const role = localStorage.getItem('role');
    if (token && role === 'Quản lý') {
      return true;
    } else {
      router.navigate(['/admin']); // Điều hướng đến trang đăng nhập nếu chưa đăng nhập
      return false;
    }
  }
  // Nếu chạy trên server, trả về false hoặc xử lý logic khác
  return false;
};

export const staffAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Kiểm tra nếu đang chạy trên môi trường trình duyệt (client)
  if (typeof window !== 'undefined' && window.localStorage) {
    const token = localStorage.getItem('user_token');
    const role = localStorage.getItem('role');
    if (token && (UpTower(role) === 'customer' || role === 'admin')) {
      return true;
    } else {
      router.navigate(['/admin']);
      return false;
    }
  }
  // Nếu chạy trên server, trả về false hoặc xử lý logic khác
  return false;
};

function UpTower(data: string | null): string {
  if (data) {
    return data.toLowerCase();
  }
  return '';
}
