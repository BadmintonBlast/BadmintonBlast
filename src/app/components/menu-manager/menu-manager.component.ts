import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ManagerCustomerComponent } from '../../admin/managerCustomer/manager-customer.component';
import { ManagerProductComponent } from '../../admin/manager-product/manager-product.component';
import { AddProductComponent } from '../../admin/add-product/add-product.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { OrderComponent } from '../../admin/order/order.component';
import { CustomersService } from '../../../services/customer/customers.service';
import { DashboardComponent } from '../../admin/dashboard/dashboard.component';
import { VoucherComponent } from '../../admin/voucher/voucher.component';
import { Title } from '@angular/platform-browser';
import { BrandManagerComponent } from "../../admin/brand-manager/brand-manager.component";
import { InvoiceComponent } from "../../admin/invoice/invoice.component";
@Component({
  selector: 'app-menu-manager',
  standalone: true,
  imports: [
    NgIf,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatButtonModule,
    ManagerCustomerComponent,
    ManagerProductComponent,
    AddProductComponent,
    OrderComponent,
    DashboardComponent,
    VoucherComponent,
    BrandManagerComponent,
    InvoiceComponent
],
  templateUrl: './menu-manager.component.html',
  styleUrl: './menu-manager.component.css',
})
export class MenuManagerComponent {
  manager: string = ''; // Biến theo dõi loại trang
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customer: CustomersService,
    private title:Title
  ) {}
  ngOnInit(): void {
    this.title.setTitle('Trang quản lý - Badminton Blast')
    // Lấy chỉ số từ URL và cập nhật biến manager
    this.route.params.subscribe((params) => {
      this.manager = params['index'];
    });
  }

  selectIcon(index: string): void {
    this.router.navigate(['menu', index]);
    this.manager = index;
  }

  logout() {
    this.customer.removeToken();
    this.router.navigate(['home']);
  }
}
