import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule cho *ngFor
import { ProductService } from '../../../services/product/product.service';
import { IProduct } from '../../../interfaces/i-Product';
import { StaticalResultService } from '../../../services/StatiscalResult/statical-result.service';
import { IProductSalesDTO } from '../../../interfaces/i-StatiscalResult';
import { SharedService } from '../../../services/Share.service';
import { Router } from '@angular/router';
import { CouponService } from '../../../services/coupon/coupon.service';
import { ICoupons } from '../../../interfaces/i-Coupon';
@Component({
  selector: 'app-topsale',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topsale.component.html',
  styleUrl: './topsale.component.css',
})
export class TopsaleComponent {
  products: IProduct[] = [];
  productSale: IProductSalesDTO[] = [];

  constructor(
    private productservice: ProductService,
    private staticalResult: StaticalResultService,
    private shareService: SharedService,
    private router: Router,
    private couponService: CouponService
  ) {}
  ngOnInit() {
    // Sửa lại ngOnInit với đúng chữ 'I'
    this.getProductbestsale();
  }
  getProductbestsale() {
    const { startOfMonth, endOfMonth } =
      this.staticalResult.getStartAndEndOfMonth();

    // Chuyển đổi Date thành định dạng 'YYYY-MM-DD'
    const startDate = this.formatDate(startOfMonth);
    const endDate = this.formatDate(endOfMonth);
    // Gọi API với tham số ngày
    this.staticalResult
      .getTotalUniqueProducts(startDate, endDate)
      .subscribe((data) => {
        // Kiểm tra xem dữ liệu có tồn tại không
        if (data) {
          this.productSale = data;
          // Lặp qua các sản phẩm và lấy thông tin sản phẩm theo ID
          for (let product of this.productSale) {
            this.productservice
              .getProductById(product.productId)
              .subscribe((productData) => {
                this.products.push(productData);
              });
          }
        }
      });
  }
  // Hàm định dạng ngày thành 'YYYY-MM-DD'
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Thêm số 0 nếu tháng < 10
    const day = date.getDate().toString().padStart(2, '0'); // Thêm số 0 nếu ngày < 10
    return `${year}-${month}-${day}`;
  }
  detailproduct(id: number, name: string) {
    if (id === undefined || id === null) {
      console.error('ID sản phẩm không hợp lệ:', id);
      return; // Thoát khỏi hàm nếu ID không hợp lệ
    }

    if (!name) {
      console.error('Tên sản phẩm không hợp lệ:', name);
      return; // Thoát khỏi hàm nếu tên không hợp lệ
    }

    name = this.shareService.removeDiacritics(name);
    this.router.navigate(['/chitietsanpham', id, encodeURIComponent(name)]);
  }
}
