import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Kiểm tra nếu đang chạy trên môi trường trình duyệt (client)
  if (typeof window !== 'undefined' && window.localStorage) {
    const token = localStorage.getItem('user-token');
    if (token) {
      return true;
    } else {
      router.navigate(['/home']); // Điều hướng đến trang đăng nhập nếu chưa đăng nhập
      return false;
    }
  } else {
    // Nếu không phải môi trường client (SSR), bạn có thể xử lý theo cách khác (ví dụ, kiểm tra cookies)
    // Hoặc trả về false để không cho phép tiếp tục nếu không có token
    return false;
  }
};
