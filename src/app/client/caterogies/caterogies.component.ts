import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../../interfaces/i-Product';
import { ProductService } from '../../../services/product/product.service';
import { ProductlistComponent } from '../productlist/productlist.component';
import { PagingComponent } from '../../components/paging/paging.component';
import { HeaherComponent } from '../../components/heaher/heaher.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../services/Share.service';
import { BrandService } from '../../../services/brand/brand.service';
import { IBrand } from '../../../interfaces/i-Brand';
import { KindproductService } from '../../../services/kindproduct/kindproduct.service';
import { Ikindproduct } from '../../../interfaces/i-KindProduct';
import { Navigation } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    HeaherComponent,
    FooterComponent,
    CommonModule,
    FormsModule 
  ],
  templateUrl: './caterogies.component.html',
  styleUrls: ['./caterogies.component.css'],
})
export class CategoriesComponent {
  Math = Math;
  products: IProduct[] = [];
  total: number = 0;
  pageSize: number = 40; // Default page size
  pageIndex: number = 1; // Initial page index
  shouldWrap: boolean = true;
  Idkindproduct: number = 0;
  keyword: string = '';
  discount: number = 0;
  productName: string = '';
  brand: IBrand[] = [];
  kindproduct: Ikindproduct[] = [];
  idbrand:number=0;
  minPrice: number = 0;
  maxPrice: number = 0;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private shareService: SharedService,
    private brandService: BrandService,
    private kindproductService: KindproductService,
    private router: Router,
    private title:Title
  ) {
    this.title.setTitle('Danh sach sản phẩm - Badminton Blast')
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.Idkindproduct = +params['id'];
      }
      if (params['name']) {
        this.productName = params['name'];
      }
      if (params['keyword']) {
        this.keyword = params['keyword'];
      }
      this.getBrand();
      this.getkindproduct();
      this.getProducts(
        this.keyword,
        this.Idkindproduct,
        this.pageSize,
        this.pageIndex,
        this.discount,  
        this.idbrand,
        this.minPrice,
        this.maxPrice,
      );
    });
  }
  selectedKindProductId: number =0; 
  selectedbrandId: number =0;
  filterbrand(brand: number, name: string, event: any): void {
    // Kiểm tra nếu checkbox được chọn
    if (event.target.checked) {
      this.selectedbrandId = brand; // Gán ID brand được chọn
    }
    this.getProducts(
      this.keyword,
      this.selectedKindProductId, // Lọc theo loại sản phẩm nếu có
      this.pageSize,
      this.pageIndex,
      this.discount,
      this.selectedbrandId, // Lọc theo thương hiệu
      this.minPrice,
      this.maxPrice
    );
  } 
  filterkind(kindproductId: number,name:string, event: any): void {
    if (event.target.checked) {
      this.selectedKindProductId = kindproductId; 
    } 
    name =this.shareService.removeDiacritics(name)
    this.router.navigate(['sanpham', kindproductId, name]);
    this.getProducts(
      this.keyword, 
      this.selectedKindProductId, 
      this.pageSize, 
      this.pageIndex, 
      this.discount, 
      this.idbrand, // Nếu có lọc theo nhãn hiệu
      this.minPrice, 
      this.maxPrice
    );
  }

  getkindproduct()
  {
    this.kindproductService.getKindproducts().subscribe((data) => {
      this.kindproduct=data
    });
  }
  getBrand() {
    this.brandService.getAllBrands().subscribe((data) => {
      this.brand = data;
    });
  }
  changediscount(price: number, discountPercent: number): number {
    return price * (1 - discountPercent / 100);
  }

  getProducts(
    keyword: string,
    Idkindproduct: number,
    pageSize: number,
    pageIndex: number,
    discount: number,
    idbrand:number ,
    minPrice: number ,
    maxPrice: number ,
  ) {
    this.productService
      .getProductsAsync(keyword, Idkindproduct, pageIndex, pageSize, discount,idbrand,minPrice,maxPrice)
      .subscribe((data) => {
        this.products = data;
        console.log('Product Data:', data);
      });

    // Lấy tổng số sản phẩm
    this.productService
      .getTotalProduct(keyword, Idkindproduct, discount,idbrand, minPrice, maxPrice)
      .subscribe((data) => {
        console.log('Total Products:', data);
        this.total = data;
      });
  }
  // Hàm thay đổi trang
  onPageChanged(newPageIndex: number) {
    this.pageIndex = newPageIndex;
    this.getProducts(
      this.keyword,
      this.Idkindproduct,
      this.pageSize,
      this.pageIndex,
      this.discount,
      this.idbrand,
      this.minPrice,
      this.maxPrice
    );
  }
  fillterPrice()
  {
    this.products=[]
    console.log(this.minPrice,this.maxPrice)
    this.getProducts(
      this.keyword,
      this.Idkindproduct,
      this.pageSize,
      this.pageIndex,
      this.discount,
      this.idbrand,
      this.minPrice,
      this.maxPrice
    );
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
  
    name= this.shareService.removeDiacritics(name);  
    this.router.navigate(['/chitietsanpham', id, encodeURIComponent(name)]);
  }
}
