import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { ValidationService } from '../../../services/validation/validation.service';
import { NgIf,NgFor,CommonModule, } from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [NgIf,NgFor,CommonModule,
    FormsModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.css'
})
export class LoginAdminComponent {    
   
 constructor(private validationService: ValidationService)
 {
 }
 isInputDisabledPass: boolean =true;
 showRegister = false;
 otpCode: string = ''; // Biến lưu OTP người dùng nhập
 isOtpDisabled: boolean = true; // Trạng thái xác minh OTP
 isemail: boolean=false;

 verifyOTP() {
   // Giả sử ở đây là logic để kiểm tra OTP
  
 }
  showRegisterForm() {
    this.showRegister = !this.showRegister;
  }   
}
