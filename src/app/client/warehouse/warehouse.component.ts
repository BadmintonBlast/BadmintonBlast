import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaherComponent } from '../../components/heaher/heaher.component';
import { CartService } from '../../../services/cart/cart.service';
import { ICart } from '../../../interfaces/i-Cart';
import { CustomersService } from '../../../services/customer/customers.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product/product.service';
import { IProduct } from '../../../interfaces/i-Product';
import { Router } from '@angular/router';
import { NotificationComponent } from '../../notification/notification.component';
import { CouponService } from '../../../services/coupon/coupon.service';
import { ICoupons } from '../../../interfaces/i-Coupon';
import { DataShareService } from '../../../services/Data/data-share.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [
    HeaherComponent,
    FooterComponent,
    CommonModule,
    NotificationComponent,
  ],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.css',
})
export class WarehouseComponent {
  idcustomer: number;
  cartList: ICart[] = [];
  productOrderIds: { [key: number]: IProduct[] } = {};
  hidenotify: boolean = false;
  message: string = '';
  constructor(
    private CartService: CartService,
    private customerService: CustomersService,
    private ProductService: ProductService,
    private router: Router,
    private couponService: CouponService,
    private dataShareService: DataShareService,
    private title: Title
  ) {
    this.title.setTitle('Giỏ hàng - Badminton Blast');
    this.idcustomer = this.customerService.getClaimValue();
    this.getCart();
    this.getCoupon();
  }
  getCart() {
    this.CartService.getCartById(this.idcustomer).subscribe((data) => {
      this.cartList = data;
      this.cartList.forEach((order) => {
        this.getProductId(order.idproduct); // Lấy thông tin sản phẩm cho từng idproduct
      });
    });
  }
  totalquantity(quantity: number, price: number): number {
    return quantity * price;
  }
  getProductId(idproduct: number): void {
    this.ProductService.getProductById(idproduct).subscribe((data) => {
      if (!this.productOrderIds[data.idproduct]) {
        this.productOrderIds[data.idproduct] = [];
      }
      this.productOrderIds[data.idproduct].push(data);
    });
  }
  idcart: boolean[] = [];
  checkidCart(idcart: number) {
    console.log(this.idcart);
    this.idcart[idcart] = !this.idcart[idcart];
    this.buy();
  }
  checkall: boolean = false;
  checkAll() {
    const isAllChecked = this.cartList.every(
      (item) => this.idcart[item.idcart] === true
    );

    if (isAllChecked) {
      // Nếu tất cả đều đã được check, thì tắt hết
      this.cartList.forEach((item) => {
        this.idcart[item.idcart] = false;
        this.buy();
      });
    } else {
      // Nếu chưa check hết, thì bật tất cả
      this.cartList.forEach((item) => {
        this.idcart[item.idcart] = true;
        this.buy();
      });
    }
  }
  couponList: ICoupons[] = [];
  selectedCoupon: number = -1;
  totalAll: number = 0;
  getCoupon() {
    this.couponService.getCoupons().subscribe((data) => {
      const currentDate = new Date(); // Lấy ngày giờ hiện tại

      // Đặt currentDate về 00:00:00
      currentDate.setHours(0, 0, 0, 0);

      this.couponList = data.filter((coupon) => {
        const endDate = new Date(coupon.enddate); // Chuyển enddate từ chuỗi sang Date

        // Đặt endDate về 00:00:00
        endDate.setHours(0, 0, 0, 0);

        // So sánh ngày
        return endDate >= currentDate;
      });
    });
  }
  Coupon: number = 0;
  changeCoupon(i: number) {
    this.totalAll = this.totalbuy;
    this.selectedCoupon = i;
    this.totalAll -= this.couponList[i].promotion;
    this.Coupon = this.couponList[i].idcoupon;
  }

  preprice(price: number, present: number): number {
    return (price * (100 - present)) / 100;
  }
  quanlity(kind: string, cart: ICart) {
    if (kind === '-') {
      cart.quatity--;
      this.CartService.updateCart(cart.idcart, cart).subscribe({
        next: () => {
          this.buy();
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else if (kind === '+') {
      cart.quatity++;
      this.CartService.updateCart(cart.idcart, cart).subscribe({
        next: () => {
          this.buy();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  databuy: ICart[];
  totalbuy: number = 0;
  buy() {
    this.totalbuy = 0;
    this.totalAll = 0;
    this.cartList.forEach((item) => {
      if (this.idcart[item.idcart] === true) {
        this.productOrderIds[item.idproduct].forEach((product) => {
          this.totalbuy += this.preprice(product.price,product.deprice) * item.quatity;
          this.totalAll = this.totalbuy;
        });
      }
    });
  }

  closeCart(idcart: number) {
    {
      this.CartService.deleteCart(idcart).subscribe((data) => {
        this.cartList = [];
        this.productOrderIds = {};
        this.getCart(); // Cập nhật lại danh sách cart
      });
    }
  }

  payment() {
    if (this.idcart.length > 0) {
      this.dataShareService.setDatabuy(this.idcart);
      this.dataShareService.setTotalbuy(this.totalAll);
      this.dataShareService.setCoupon(this.Coupon);
      this.dataShareService.setTotalPrice(this.totalbuy);
      this.router.navigate(['/thanhtoan']);
    } else {
      this.message = 'Vui lòng chọn sản phẩm trước khi thanh toán!';
      this.hidenotify = true;
      setTimeout(() => {
        this.hidenotify = false;
      }, 2000);
    }
  }
}
