import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product/product.service';
import { IProduct } from '../../../interfaces/i-Product';
import { ProductlistComponent } from '../productlist/productlist.component';
import { ActivatedRoute } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaherComponent } from '../../components/heaher/heaher.component';
import { SharedService } from '../../../services/Share.service';
import { PreviewService } from '../../../services/preview/preview.service';
import { IPreview } from '../../../interfaces/i-Preview';
import { CartService } from '../../../services/cart/cart.service';
import { ICart } from '../../../interfaces/i-Cart';
import { MatIconModule } from '@angular/material/icon';
import { CustomersService } from '../../../services/customer/customers.service';
import { NotificationComponent } from '../../notification/notification.component';
import { Router } from '@angular/router';
import { CouponService } from '../../../services/coupon/coupon.service';
import { ICoupons } from '../../../interfaces/i-Coupon';
import { IProductStock } from '../../../interfaces/i-ProductStock';

declare var FB: any;
import { Meta, Title } from '@angular/platform-browser';
import { error } from 'console';
import { PreviewProductComponent } from '../preview-product/preview-product.component';
@Component({
  selector: 'app-detailproduct',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    HeaherComponent,
    MatIconModule,
    NotificationComponent,
    PreviewProductComponent,
  ],
  templateUrl: './detailproduct.component.html',
  styleUrl: './detailproduct.component.css',
})
export class DetailproductComponent {
  Math = Math;
  product: IProduct | null = null;
  productKind: number = 0;
  productsKind: IProduct[] = [];
  selectedProductStock: any = null;
  selectedImage: any = null;
  ImageIndex: number = 0;
  productId: number = 0;
  productName: string = '';
  shouldSwap: boolean = true;
  totalpreview: number = 0;
  previews: IPreview[] = [];
  rating: number = 0; // Total rating value loaded from the backend
  fullStars: number[] = [];
  hasHalfStar: boolean = false;
  emptyStars: number[] = [];
  totalReviews: number = 0; // Total number of reviews or ratings
  maxRating: number = 5;
  idcustomer: number = 0;
  hidenotify: boolean = false;
  message: string = '';
  currentUrl: string = '';
  selectedIndex: number = -1;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private preview: PreviewService,
    private cartService: CartService,
    private sharedService: SharedService,
    private customerService: CustomersService,
    private router: Router,
    private meta: Meta,
    private title: Title,
    private couponService: CouponService
  ) {}
  ngOnInit() {
    this.currentUrl = this.router.url;
    this.getCoupons();
    this.route.params.subscribe((params) => {
      this.productId = +params['id']; // + để chuyển đổi thành số
      this.productName = decodeURIComponent(params['name']); // Giải mã tên sản phẩm
    });

    if (this.productId) {
      // Get the product details by ID
      this.productService.getProductById(this.productId).subscribe((data) => {
        this.product = data;
        this.selectedImage = this.product?.image?.[0]
          ? this.product.image[0].image4
          : null;
        this.updateMetaTags();
        this.updateIndexHtmlMetaTags();
        this.preview
          .getIdPreview(this.productId)
          .subscribe((data: IPreview[]) => {
            this.previews = data;
            this.totalpreview = data.length;
            if (this.totalpreview > 0) {
              // Calculate the total rating, ensuring Preview1 is defined
              this.rating =
                data.reduce((acc, preview) => {
                  return acc + (preview.preview1 || 0); // Safely add preview value
                }, 0) / this.totalpreview; // Calculate average
            } else {
              this.rating = 0; // Default rating if no previews
            }
          });
        this.star();
      });
    }
  }
  coupon: ICoupons[] = [];
  getCoupons() {
    this.couponService.getCoupons().subscribe((coupons) => {
      const currentDate = new Date(); // Lấy ngày giờ hiện tại
      this.coupon = coupons.filter((coupon) => {
        const endDate = new Date(coupon.enddate); // Chuyển enddate từ chuỗi sang Date
        // Đặt endDate về 23:59:59 (ngày cuối cùng trong ngày)
        endDate.setHours(23, 59, 59, 999);
  
        // So sánh ngày (so sánh với endDate đã đặt thời gian là 23:59:59)
        return endDate >= currentDate;
      });
    });
  }
  
  datacart: ICart;
  addCart(kind: string) {
    this.idcustomer = this.customerService.getClaimValue();

    if (this.idcustomer === 0) {
      this.showMessage('Vui lòng đăng nhập', false);
      return;
    }

    if (this.quantityValue === 0) {
      this.showMessage('Vui lòng chọn số lượng', false);
      return;
    }

    if (this.product.productstocks.length === 0) {
      this.datacart = {
        idcart: 0,
        idproduct: this.productId,
        idcustomer: this.idcustomer,
        quatity: this.quantityValue,
        color: '',
        size: '',
        idproductstock: null,
      };
    } else if (this.selectedIndex !== -1) {
      const selectedStock = this.product.productstocks[this.selectedIndex];
      this.datacart = {
        idcart: 0,
        idproduct: this.productId,
        idcustomer: this.idcustomer,
        quatity: this.quantityValue,
        color: selectedStock.namecolor,
        size: selectedStock.namesize,
        idproductstock: selectedStock.id,
      };
    } else {
      this.showMessage('Vui lòng chọn màu và size', false);
      return;
    }

    this.cartService.addCart(this.datacart).subscribe({
      next: () => {
        if (kind === 'route') {
          this.showMessage('Thêm vào giỏ hàng thành công', true);
        } else {
          this.showMessage('Thêm vào giỏ hàng thành công', false);
        }
      },
      error: () => {
        this.showMessage('Sản phẩm đã được thêm vào giỏ hàng', false);
      },
    });
  }

  showMessage(message: string, navigateToCart: boolean) {
    if (navigateToCart) {
      this.router.navigate(['/giohang']);
    } else {
      this.message = message;
      this.hidenotify = true;
      setTimeout(() => {
        this.hidenotify = false;
      }, 2000);
    }
  }

  quantityValue: number = 1;
  quantity(value: string) {
    if (value === '-') {
      if (this.quantityValue === 0) {
        return;
      }
      this.quantityValue = this.quantityValue - 1;
    } else if (value === '+') {
      this.quantityValue = this.quantityValue + 1;
    }
  }
  selectButton(i: number) {
    this.selectedIndex = i;
  }
  total: number = 0;
  pageSize: number = 8; // Default page size
  pageIndex: number = 1; // Initial page index
  kindproduct: number = 0;

  getProducts(kindproduct: number, pageSize: number, pageIndex: number) {
    this.productService
      .getProductsAsync('', kindproduct, pageIndex, pageSize, 0, 0, 0, 0)
      .subscribe((data) => {
        this.productsKind = data;
      });

    // Lấy tổng số sản phẩm
    this.productService
      .getTotalProduct('', kindproduct, 0, 0, 0, 0)
      .subscribe((data) => {
        this.total = data; // Cập nhật tổng số sản phẩm
      });
  }
  changediscount(price: number, discountPercent: number): number {
    return (price * (100 - discountPercent)) / 100;
  }

  selectImage(image: number): void {
    this.ImageIndex = image;
    this.selectedImage = this.product.image[image].image4;
  }

  star() {
    const fullStarsCount = Math.floor(this.rating); // Số sao đầy
    const hasHalfStar = this.rating % 1 !== 0; // Xác định nếu có nửa sao
    const emptyStarsCount = 5 - fullStarsCount - (hasHalfStar ? 1 : 0); // Số sao trống

    // Tạo mảng sao
    this.fullStars = Array(fullStarsCount).fill(0); // Số lượng sao đầy
    this.hasHalfStar = hasHalfStar; // Nửa sao nếu cần
    this.emptyStars = Array(emptyStarsCount).fill(0); // Số lượng sao trống
  }
  addToCart(product: IProduct): void {
    console.log('Adding to cart:', product);
    // Add logic to handle adding to cart
  }

  addToWishlist(product: IProduct): void {
    console.log('Adding to wishlist:', product);
    // Add logic to handle adding to wishlist
  }

  updateMetaTags(): void {
    if (this.productId) {
      const fileName = this.product.image[0].image4.toString();
      this.title.setTitle(this.product.nameproduct);
      const metaTags = [
        { property: 'og:url', content: this.currentUrl },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: this.product.nameproduct },
        { property: 'og:description', content: this.product.description },
        { property: 'og:image', content: fileName },
      ];
      metaTags.forEach((tag) => this.meta.updateTag(tag));
    }
  }
  updateIndexHtmlMetaTags(): void {
    // Tạo mảng các thẻ meta
    if (this.product) {
      const metaTags = [
        { name: 'robots', content: 'INDEX,FOLLOW' },
        { name: 'keywords', content: this.product.nameproduct },
        { name: '' },
        {
          name: 'description',
          content: this.product.description,
        },
      ];

      // Cập nhật các thẻ meta trong index.html
      metaTags.forEach((tag) => {
        this.meta.updateTag(tag);
      });
    }
  }
}
