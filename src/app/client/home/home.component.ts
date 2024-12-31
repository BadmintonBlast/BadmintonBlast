import { Component, OnInit, HostListener } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { IProduct } from '../../../interfaces/i-Product';
import { CommonModule } from '@angular/common';
import { ProductlistComponent } from '../productlist/productlist.component';
import { Ikindproduct } from '../../../interfaces/i-KindProduct';
import { KindproductService } from '../../../services/kindproduct/kindproduct.service';
import { HeaherComponent } from '../../components/heaher/heaher.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { PagingComponent } from '../../components/paging/paging.component';
import { BrandComponent } from '../brand/brand.component';
import { FlashSaleComponent } from "../flash-sale/flash-sale.component";
import { TopsaleComponent } from "../topsale/topsale.component";
import { SharedService } from '../../../services/Share.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Title,Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ProductlistComponent,
    HeaherComponent,
    FooterComponent,
    BrandComponent,
    FlashSaleComponent,
    TopsaleComponent,
    
],
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit {
  productsracker: IProduct[] = [];
  productshoes: IProduct[] = [];
  currentRacketIndex: number = 0; // Current index for racket products
  currentShoeIndex: number = 0; // Current index for shoe products
  itemsToShow: number = 12; // Number of products to show at a time
  kindproduct: Ikindproduct[] = [];
  autoSlideInterval: any;
  constructor(
    private productService: ProductService,
    private kindproductService: KindproductService,
    private sharedService: SharedService,
    private router: Router,
    private title: Title,
    private meta: Meta,
  ) {}
  showOverlay: boolean = false;
  ngOnInit(): void {
    this.title.setTitle('Trang chủ - Badminton Blast');
    this.showSlides(this.slideIndex);
    this.getKindProductService();
    this.getAllProducts(1); 
  }
  onMouseEnter() {
    this.autoSlideInterval = setInterval(() => {
      this.plusSlides(1);
    }, 1200); // 2000ms = 2 giây
  }
  
  // Hàm xử lý khi chuột di chuyển ra khỏi hình ảnh
  onMouseLeave() {
    // Dừng Interval khi chuột rời đi
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
    
  getKindProductService() {
    this.kindproductService.getKindproducts().subscribe((data) => {
      this.kindproduct = data;
    });
  }
  getAllProducts(kindproduct: number): void {
    this.productService
      .getProductsAsync('', 0, 1, 18,0,0,0,0)
      .subscribe((data) => {
        if (kindproduct === 2) {
          this.productshoes = data || [];
        } else {
          this.productsracker = data || [];
        }
      });
  }

  slides = [
    { imgUrl: 'assets/banner/7.png' },
    { imgUrl: 'assets/banner/1.png' },
    { imgUrl: 'assets/banner/4.png' }
  ];
  
  slideIndex = 1;
  plusSlides(n: number) {
    this.showSlides(this.slideIndex += n);
  }

  showSlides(n: number) {
    if (n > this.slides.length) { this.slideIndex = 1; }    
    if (n < 1) { this.slideIndex = this.slides.length; }
  }

  showkindproduct(idkindproduct:number,name:string) 
  {
    if (idkindproduct) {
      name=this.sharedService.removeDiacritics(name); 
      this.router.navigate(['sanpham', idkindproduct, name]);
    }
  }
}
