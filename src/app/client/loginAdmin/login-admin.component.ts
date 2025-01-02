import { Input, EventEmitter, Output } from '@angular/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OtpService } from '../../../services/otp/otp.service';
import { ICustomer } from '../../../interfaces/i-Customers';
import { NotificationComponent } from '../../notification/notification.component';
import { CustomersService } from '../../../services/customer/customers.service';
import { ILogin } from '../../../interfaces/i-Customers';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    NotificationComponent,
  ],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.css',
})
export class LoginAdminComponent {
  @Input() loginstatus: boolean = false;
  @Output() closeFormEvent = new EventEmitter<void>();
  constructor(
    private otpservice: OtpService,
    private customerservice: CustomersService,
    private router: Router
  ) {}
  showRegister = false;
  forget = false;
  routerforget = '';
  showlogin = true;
  message: string = '';
  hidenotify = false;
  otpCode: string = '';
  isOtpDisabled: boolean = true;
  isemail: boolean = false;
  login: ILogin = {
    email: '',
    password: '',
  };
  customer: ICustomer = {
    idcustomer: 0,
    namecustomer: '',
    imageCustomer: null,
    phone: '',
    province: '',
    district: '',
    village: '',
    hamlet: '',
    email: '',
    passwordHash: '',
    status: true,
    role: 'Customer',
    birthday: new Date(),
  };
  isDisabled: boolean = true; // Input bị khóa lúc đầu
  changeColor: boolean = false; // Để thay đổi class CSS
  otp: string = ''; // Biến lưu trữ OTP
  newPassword: string = '';
  confirmPassword: string = '';
  checkOtpNewPassword: boolean = false;
  ngOnInit() {}

  submitlogin(email: string, password: string): void {
    this.hidenotify = false; // Reset notification state
  
    // Check if the email exists
    this.customerservice.getEmail(email).subscribe(
      (exists) => {
        if (exists) {
          // Proceed with login if email exists
          this.customerservice.insertlogin(email, password).subscribe(
            (data) => {
              this.message = data;
              this.hidenotify = true;
  
              setTimeout(() => {
                this.hidenotify = false;
  
                if (this.message === 'Đăng nhập thành công') {
                  // Navigate to the customer dashboard on successful login
                  this.router.navigate(['/khachhang']);
                } else {
                  // Show "Forgot Password" option if login fails
                  this.routerforget = 'Quên mật khẩu';
                }
              }, 1000);
            },
            (error) => {
              // Handle error during login
              this.message = 'Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.';
              this.hidenotify = true;
  
              setTimeout(() => {
                this.hidenotify = false;
              }, 2000);
            }
          );
        } else {
          // Email does not exist
          this.message = 'Email không tồn tại. Vui lòng kiểm tra lại.';
          this.hidenotify = true;
  
          setTimeout(() => {
            this.hidenotify = false;
          }, 2000);
        }
      },
      (error) => {
        // Handle error during email check
        this.message = 'Đã xảy ra lỗi khi kiểm tra email. Vui lòng thử lại.';
        this.hidenotify = true;
  
        setTimeout(() => {
          this.hidenotify = false;
        }, 2000);
      }
    );
  }
  
  checkEmail(email: string): void {
    if (email && email.trim()) {
      this.otpservice.OTPEmail(email).subscribe((response) => {
        this.message = response; // Nhận thông báo từ OTPEmail
        this.hidenotify = true;
        setTimeout(() => {
          this.hidenotify = false; // Ẩn thông báo sau 2 giây
          this.isemail = true;
        }, 2000);
      });
    }
  }

  onOTPChange(value: string, email: string): void {
    this.otp = value; // Cập nhật giá trị OTP mới
    // Kiểm tra nếu OTP đủ 6 ký tự
    if (this.otp.length === 6) {
      this.verifyOTP(email, value); // Truyền OTP mới vào hàm verify
    }
  }
  verifyOTP(email: string, otp: string): void {
    console.log(email);
  
    // Disable button and reset state during the process
    this.isDisabled = true;
    this.changeColor = false;
    this.hidenotify = false;
  
    // Directly verify the OTP without checking email existence
    this.otpservice.CheckOTPEmail(email, otp).subscribe(
      (response) => {
        // Successful OTP verification
        this.isDisabled = false; // Unlock input
        this.changeColor = true;
      },
      (error) => {
        // OTP invalid or expired
        this.message = 'Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.';
        this.hidenotify = true; // Show notification
  
        // Automatically hide notification after 2 seconds
        setTimeout(() => {
          this.hidenotify = false;
        }, 2000);
  
        // Re-enable the button in case of error
        this.isDisabled = false;
      }
    );
  }
  
  

  register(): void {
    // Create a new FormData object
    const formData = new FormData(); 
    // Append the customer data
    formData.append('idcustomer', this.customer.idcustomer.toString());
    formData.append('namecustomer', this.customer.namecustomer);
    formData.append('imageCustomer', null);
    formData.append('phone', this.customer.phone);
    formData.append('province', this.customer.province);
    formData.append('district', this.customer.district);
    formData.append('village', this.customer.village);
    formData.append('hamlet', this.customer.hamlet);
    formData.append('email', this.customer.email);
    formData.append('passwordHash', this.customer.passwordHash);
    formData.append('status', this.customer.status.toString());
    formData.append('role', this.customer.role);
    formData.append('birthDay', this.customer.birthday.toISOString().split('T')[0]);
   
  
  
    // Call the service to send the form data
    this.customerservice.insertCustomer(formData).subscribe({
      next: () => {
        this.message = 'Đăng ký thành công!';
        this.hidenotify = true;
        setTimeout(() => {
          this.hidenotify = false; // Hide notification after 2 seconds
        }, 2000);
      },
      error: (err) => {
        this.message = 'Lỗi trong quá trình đăng ký';
        this.hidenotify = true;
        setTimeout(() => {
          this.hidenotify = false; // Hide notification after 2 seconds
        }, 2000);
      },
    });
  }
  
  
  closeForm() {
    this.closeFormEvent.emit();
  }

  showForget() {
    const check = this.checkEmail(this.login.email);
    if (check !== null) {
      this.forget = !this.forget;
      this.showlogin = !this.showlogin;
    }
  }
  showRegisterForm() {
    this.showRegister = !this.showRegister;
    this.showlogin = !this.showlogin;
  }
  changePassword() {
    if (this.newPassword == this.confirmPassword) {
      this.customerservice
        .changePassword(this.login.email, this.newPassword)
        .subscribe({
          next: (response) => {
            this.message = 'Đổi mật khẩu thành công';
            this.hidenotify = true;
            setTimeout(() => {
              this.hidenotify = false;
              this.forget=false;
              this.showlogin=true;

            }, 2000);
          },
          error: (error) => {
            this.message = 'Đổi mật khẩu không thành công';
            this.hidenotify = true;
            setTimeout(() => {
              this.hidenotify = false;
            }, 1000);
          },
        });
    } else {
      this.message = 'Mật khẩu nhập lại không đúng';
      this.hidenotify = true;
      setTimeout(() => {
        this.hidenotify = false; // ��n thông báo sau 2 giây
      }, 1000);
    }
  }
}
