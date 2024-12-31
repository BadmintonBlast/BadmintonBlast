import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { Router } from '@angular/router';
import { IProduct } from '../../../interfaces/i-Product';
import { SharedService } from '../../../services/Share.service';
import { CouponService } from '../../../services/coupon/coupon.service';
import { ICoupons } from '../../../interfaces/i-Coupon';
@Component({
  selector: 'app-productlist',
  standalone: true,
  imports: [CommonModule, NgbTooltipModule, MatIconModule, CommonModule],
  templateUrl: './productlist.component.html',
  styleUrl: './productlist.component.css',
})
export class ProductlistComponent {
  @Input() productList: IProduct[] = [];
  @Input() shouldWrap: boolean = false;
  rating = 2.3; // Điểm đánh giá của bạn
  fullStars: number[] = [];
  hasHalfStar: boolean = false;
  emptyStars: number[] = [];

  ngOnInit() {
    this.getCoupon();
    const fullStarsCount = Math.floor(this.rating); // Số sao đầy
    const hasHalfStar = this.rating % 1 !== 0; // Xác định nếu có nửa sao
    const emptyStarsCount = 5 - fullStarsCount - (hasHalfStar ? 1 : 0); // Số sao trống

    // Tạo mảng sao
    this.fullStars = Array(fullStarsCount).fill(0); // Số lượng sao đầy
    this.hasHalfStar = hasHalfStar; // Nửa sao nếu cần
    this.emptyStars = Array(emptyStarsCount).fill(0); // Số lượng sao trống
  }
  constructor(
    private router: Router,
    private shareService: SharedService,
    private couponService: CouponService
  ) {}
  coupon: ICoupons[] = [];

  getCoupon() {
    this.couponService.getCoupons().subscribe((coupons) => {
      const currentDate = new Date(); // Lấy ngày giờ hiện tại
      this.coupon = coupons.filter(
        (coupon) => new Date(coupon.enddate) >= currentDate
      );
    });
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
