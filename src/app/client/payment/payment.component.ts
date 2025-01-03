import { Component, OnInit } from '@angular/core';
import { HeaherComponent } from '../../components/heaher/heaher.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { DataShareService } from '../../../services/Data/data-share.service';
import { ICart } from '../../../interfaces/i-Cart';
import { CartService } from '../../../services/cart/cart.service';
import { CustomersService } from '../../../services/customer/customers.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product/product.service';
import { IProduct } from '../../../interfaces/i-Product';
import { Title } from '@angular/platform-browser';
import { ICustomer } from '../../../interfaces/i-Customers';
import { FormsModule } from '@angular/forms';
import { PaypalService } from '../../../services/paypal/paypal.service';
import { OrderService } from '../../../services/order/order.service';
import { BillService } from '../../../services/bill/bill.service';
import { IOrder } from '../../../interfaces/i-Order';
import { IBill } from '../../../interfaces/i-Bill';
import { ICoupons } from '../../../interfaces/i-Coupon';
import { NotificationComponent } from '../../notification/notification.component';
import { Router, Navigation } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ProductstockService } from '../../../services/productstock/productstock.service';
import { IProductStock } from '../../../interfaces/i-ProductStock';
import { concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CouponService } from '../../../services/coupon/coupon.service';
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    FormsModule,
    HeaherComponent,
    FooterComponent,
    CommonModule,
    NotificationComponent,
    RouterModule,
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent {
  constructor(
    private dataShareService: DataShareService,
    private cartService: CartService,
    private customerService: CustomersService,
    private productService: ProductService,
    private title: Title,
    private paypalService: PaypalService,
    private orderService: OrderService,
    private billService: BillService,
    private router: Router,
    private productStockService: ProductstockService,
    private couponService:CouponService
  ) {}
  exchangeRate: number = 0;
  databuy: boolean[] = [];
  idCustomer: number = 0;
  totalbuy: number = 0;
  coupon: number = 0;
  totalPrice: number = 0;
  productBuy: ICart[] = [];
  productOrderIds: { [key: number]: IProduct[] } = {};
  dataCustomer: ICustomer;
  address: string = '';
  dataCoupon: ICoupons;
  selectedPaymentMethod: string = '';
  message: string = '';
  displayNotification: boolean = false;
  ngOnInit() {
    this.fetchExchangeRate();
    this.idCustomer = this.customerService.getClaimValue();
    this.customerService.getCustomerId(this.idCustomer).subscribe((data) => {
      this.dataCustomer = data;
      this.address =
        this.dataCustomer.hamlet +
        ', ' +
        this.dataCustomer.village +
        ', ' +
        this.dataCustomer.district +
        ', ' +
        this.dataCustomer.province;
    });
    this.title.setTitle('Thanh toán - Badminton Blast');
    this.idCustomer = this.customerService.getClaimValue();
    this.dataShareService.databuy$.subscribe((data) => {
      this.databuy = data;
      if (!this.databuy || this.databuy.length === 0) {
        this.router.navigate(['/giohang']); // Chuyển hướng đến trang giỏ hàng
      }
    });
    this.dataShareService.totalPrice$.subscribe((data) => {
      this.totalPrice = data;
    });
    this.dataShareService.totalbuy$.subscribe((data) => {
      this.totalbuy = data;
    });
    this.dataShareService.coupon$.subscribe((data) => {
      this.coupon = data;
      this.getCoupon();
    });
    this.getProductBuy();
  }
  changeAdress() {
    this.dataShareService.setDatabuy(this.databuy);
    this.dataShareService.setTotalbuy(this.totalbuy);
    this.dataShareService.setCoupon(this.coupon);
    this.dataShareService.setTotalPrice(this.totalPrice);
    this.router.navigate(['/khachhang']); // Chuyển hướng đến trang thanh toán
  }
  getProductBuy() {
    this.cartService.getCartById(this.idCustomer).subscribe((data) => {
      data.forEach((item) => {
        if (this.databuy[item.idcart] === true) {
          this.productBuy.push(item);
          this.getProductId(item.idproduct);
        }
      });
    });
  }
  getCoupon() {
    if (this.coupon !== 0) {
      this.couponService.getIdCoupons(this.coupon).subscribe((data) => {
        this.dataCoupon = data;
      });
    }
  }
  openInNewTab() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/khachhang'])
    ); // Xây dựng URL
    window.open(url, '_blank');
  }
  fetchExchangeRate() {
    this.paypalService.getExchangeRate().subscribe({
      next: (response) => {
        this.exchangeRate = response.conversion_rates.VND;
      },
      error: (error) => {
        console.error('Không thể lấy thông tin tỷ giá: ');
      },
    });
  }
  convertVNDToUSD(amountVND: number, exchangeRate: number): number {
    // Làm tròn đến 2 chữ số thập phân và trả về dưới dạng số
    return parseFloat((amountVND / exchangeRate).toFixed(2));
  }
  displayPaypal: boolean = false;
  bill: IBill;
  order: IOrder;
  idBill: number = 0;
  moneyUsd: number = 0;
  payment() {
    // console.log(this.convertVNDToUSD(this.totalbuy, this.exchangeRate));
    if (!this.selectedPaymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán');
      return;
    }

    // Chuẩn bị dữ liệu hóa đơn
    this.bill = {
      idbill: 0,
      idcustomer: this.idCustomer,
      dateorder: new Date().toISOString(),
      namecustomer: this.dataCustomer.namecustomer,
      phone: this.dataCustomer.phone,
      address: this.address,
      totalamount: this.totalbuy,
      status: 900,
      pay: this.selectedPaymentMethod === 'paypal' ? 'Paypal' : 'COD',
      transactioncode: this.selectedPaymentMethod === 'paypal' ? '' : '',
      message: '',
      coupon: this.coupon > 0 ? this.dataCoupon.promotion : 0,
      idcoupon: this.coupon > 0 ? this.dataCoupon.idcoupon : 4,
    };
    let monney = this.convertVNDToUSD(this.totalbuy, this.exchangeRate);
    // Nếu là PayPal, xử lý thêm logic PayPal
    if (this.selectedPaymentMethod === 'paypal') {
      this.displayPaypal = true;
      this.paypalService.loadPayPalScript().then(() => {
        this.paypalService.renderPayPalButton(
          'paypal-container',
          monney,
          (details: any) => {
            // this.bill.transactioncode = details.transactioncode;
            this.handleInsertBillAndOrders();
          }
        );
      });
    } else {
      // Với COD
      this.handleInsertBillAndOrders();
    }
  }
  productStock: IProductStock = {
    id: 0,
    idproduct: 0,
    namecolor: '',
    namesize: '',
    quatity: 0,
  };
  // Xử lý chèn Bill trước, sau đó chèn Orders
  handleInsertBillAndOrders() {
    this.billService.insertBills(this.bill).subscribe((idBill) => {
      this.idBill = idBill.idBill;
      let i = 0;
      if (this.idBill !== 0) {
        // Dùng concatMap để xử lý tuần tự các yêu cầu
        this.productBuy.forEach((item) => {
          this.productOrderIds[item.idproduct].forEach((pro) => {
            const order: IOrder = {
              idorder: 0,
              idbill: this.idBill,
              idproduct: item.idproduct,
              price: this.preprice(pro.price, pro.deprice),
              nameproduct: pro.nameproduct || '',
              color: item.color,
              size: item.size,
              quatity: item.quatity,
              dateOrder: new Date().toISOString(),
            };
  
            this.orderService.insertOrder(order).pipe(
              concatMap(() => {
                // Xóa giỏ hàng sau khi đơn hàng được thêm thành công
                return this.cartService.deleteCart(item.idcart);
              }),
              concatMap(() => {
                // Lấy thông tin sản phẩm trong kho
                return this.productStockService.getIdProductStock(item.idproductstock);
              }),
              concatMap((data) => {
                // Cập nhật kho sản phẩm
                this.productStock = data;
                this.productStock.quatity -= item.quatity;
                return this.productStockService.updateProductStock(this.productStock);
              }),
              concatMap(() => {
                // Cập nhật voucher: trừ đi 1 số lượng voucher
                if (this.bill.idcoupon) {
                  this.dataCoupon.quality-=1;
                  return this.couponService.updateCoupon(this.dataCoupon);
                } else {
                  return of(null); // Nếu không có voucher, trả về một observable rỗng
                }
              })
            ).subscribe({
              next: () => {
                i++;
                // Khi tất cả các đơn hàng đã được xử lý và kho cập nhật, điều hướng đến trang khách hàng
                if (this.productBuy.length === i) {
                  this.router.navigate(['/khachhang']);
                }
              },
              error: (error) => {
                console.error('Error processing order:', error);
              }
            });
          });
        });
      }
    });
  }
  
  
  getProductId(idproduct: number): void {
    this.productService.getProductById(idproduct).subscribe((data) => {
      if (!this.productOrderIds[data.idproduct]) {
        this.productOrderIds[data.idproduct] = [];
      }
      this.productOrderIds[data.idproduct].push(data);
    });
  }

  preprice(price: number, present: number): number {
    return (price * (100 - present)) / 100;
  }
}
