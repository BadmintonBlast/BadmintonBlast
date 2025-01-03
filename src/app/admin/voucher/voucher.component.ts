import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from '../../../services/customer/customers.service';
import { ICustomer } from '../../../interfaces/i-Customers';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { PagingComponent } from '../../components/paging/paging.component';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { DetailCustomerComponent } from '../../admin/detail-customer/detail-customer.component';
import { ManagerHeaderComponent } from '../manager-header/manager-header.component';
import { CouponService } from '../../../services/coupon/coupon.service';
import { ICoupons } from '../../../interfaces/i-Coupon';
import { TableUtil } from '../managerCustomer/tableUtil';
import { AddVoucherComponent } from '../add-voucher/add-voucher.component';
@Component({
  selector: 'app-voucher',
  standalone: true,
  imports: [
    CommonModule,
    PagingComponent,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    MatMenuModule,
    MatMenu,
    ManagerHeaderComponent,
    AddVoucherComponent,
  ],
  templateUrl: './voucher.component.html',
  styleUrl: './voucher.component.css',
})
export class VoucherComponent {
  coupon: MatTableDataSource<ICoupons> = new MatTableDataSource<ICoupons>();
  pageIndex: number = 1;
  pageSize: number = 10;
  keyword: string = '';
  Math = Math;
  totalcoupon: number = 0;
  displayedColumns: string[] = [
    'Mã giảm giá',
    'Số giảm giá',
    'Ngày bắt đầu',
    'Ngày kết thúc',
    'Số lượng',
    'Hành động',
  ];
  constructor(private couponService: CouponService) {
    this.getCoupons();
  }

  getCoupons() {
    this.couponService.getCoupons().subscribe((data) => {
      this.coupon.data = data;
      this.totalcoupon = this.coupon.data.length; // Tính t��ng số hóa đơn để hiển thị phân trangcou = this.coupon.data.length; // Tính t��ng số hóa đơn để hiển thị phân trang
    });
  }
  search(key: string) {
    this.keyword = key;
    this.getCoupons();
  }
  onPageChanged(page: number) {
    this.pageIndex = page;
    this.getCoupons();
  }
  exportCustomerArrayToExcel() {
    const coupons: Partial<ICoupons>[] = this.coupon.data.map(
      ({ idcoupon, promotion, startdate, enddate, quality }) => ({
        idcoupon,
        promotion,
        startdate,
        enddate,
        quality,
      })
    );
    TableUtil.exportArrayToExcel(coupons, 'danhsachgiamgia');
  }
  addCouponhide: boolean = false;
  addCoupon() {
    this.addCouponhide = !this.addCouponhide;
  }
  idcoupon: number = 0;
  detail(id: number) {
    this.idcoupon = id;
    this.getCoupons();
  }
}
