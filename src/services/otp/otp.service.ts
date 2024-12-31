import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable,map,catchError,of} from 'rxjs';
import { HttpClient, HttpHeaders   } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class OtpService {

  constructor(private http: HttpClient) { }
  // Hàm gửi OTP
  sendOtp(toEmail: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { toEmail: toEmail };
    return this.http.post(`${environment.apiUrl}OTP/send-otp`, body, { headers });
  }
  verifyOtp(email: string, otp: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, otp };
    return this.http.post(`${environment.apiUrl}OTP/verify-otp`, body, { headers });
  }
  updatemarkOtpUsed(email: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/mark-otp-used/${encodeURIComponent(email)}`, {});
  }
  OTPEmail(email: string): Observable<string> {
    return this.sendOtp(email).pipe(
      map(() => 'Kiểm tra Email để nhận mã'),  // Xử lý thành công
      catchError((err) => {
        console.error(err); // Log lỗi ra console
        return of('Lỗi gửi mã xác thực'); // Trả về một Observable với thông báo lỗi
      })
    );
  }
  CheckOTPEmail(Email: string, OTPEmail: string): Observable<string> {
    return this.verifyOtp(Email, OTPEmail).pipe(
      map(() => 'Kiểm tra Email để nhận mã'), // Xử lý thành công
      catchError((err) => {
        console.error(err); // Log lỗi ra console
        return of('Lỗi gửi mã xác thực'); // Trả về một Observable với thông báo lỗi
      })
    ); // Kết thúc pipe
  }
  markOtpUsed(email: string)
  {
    this.updatemarkOtpUsed(email).subscribe({
      next: () => {
        // Xử lý khi xóa thành công
        console.log('Đánh dấu OTP đã sử dụng thành công');
      },
      error: (err) => {
        // Xử lý l��i khi xóa không thành công
        console.error('Lỗi đánh dấu OTP đã sử dụng:', err);
      },
    });
  }

  
}
