import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandService } from '../../../services/brand/brand.service';
import { IBrand } from '../../../interfaces/i-Brand';
import { FooterComponent } from '../footer/footer.component';
import { CategoriesComponent } from '../../client/caterogies/caterogies.component';
import { ActivatedRoute } from '@angular/router';
import { LoginAdminComponent } from '../../client/loginAdmin/login-admin.component';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/Share.service';
import { FormsModule } from '@angular/forms';
import { CustomersService } from '../../../services/customer/customers.service';
import { NotificationComponent } from '../../notification/notification.component';
@Component({
  selector: 'app-heaher',
  standalone: true,
  imports: [
    CommonModule,
    LoginAdminComponent,
    RouterModule,
    FormsModule,
    NotificationComponent,
  ],
  templateUrl: './heaher.component.html',
  styleUrl: './heaher.component.css',
})
export class HeaherComponent {
  isProductVisible = false;
  Brands: IBrand[] = [];
  isLoginOpen = false;
  idcustomer: number = 0;
  message: string = '';
  hidenotify: boolean = false;
  constructor(
    private brandservice: BrandService,
    private router: Router,
    private sharedService: SharedService,
    private customerservice: CustomersService
  ) {}
  ngOnInit() {}
  hideProduct(kindproduct: number, name: string) {
    if (kindproduct) {
      name = this.sharedService.removeDiacritics(name);
      this.router.navigate(['sanpham', kindproduct, name]);
    }
  }
  checklogin() {
    this.idcustomer = this.customerservice.getClaimValue();
    if (this.idcustomer) {
        this.router.navigate(['/khachhang']);
        this.openLogin();  
      
    } else {
      this.openLogin();
    }
  }
    cart() {
    this.idcustomer = this.customerservice.getClaimValue();
    if (this.idcustomer) {
      this.router.navigate(['/giohang']);
    } else {
      this.hidenotify = true;
      this.message = 'Vui lòng đăng nhập';
      setTimeout(() => {
        this.hidenotify = false; // Ẩn thông báo sau 2 giây
      }, 4000);
    }
  }
  // Hàm mở trang login
  openLogin() {
    this.isLoginOpen = true;
  }

  // Hàm đóng trang login
  closeLogin() {
    this.isLoginOpen = false;
  }

  inputValue: string = '';

  onEnter() {
    this.onSubmit();
  }

  onSubmit() {
    this.router.navigate(['sanpham', this.inputValue]);
  }
}
