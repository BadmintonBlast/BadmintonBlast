import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { DetailImageComponent } from '../../detail-image/detail-image.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { IProductStock } from '../../../interfaces/i-ProductStock';
import { MatTableModule } from '@angular/material/table';
import { IBrand } from '../../../interfaces/i-Brand';
import { PagingComponent } from '../../components/paging/paging.component';
import { BrandService } from '../../../services/brand/brand.service';
import { KindproductService } from '../../../services/kindproduct/kindproduct.service';
import { Ikindproduct } from '../../../interfaces/i-KindProduct';
import { ImageService } from '../../../services/image/image.service';
import { ProductService } from '../../../services/product/product.service';
import { IProduct } from '../../../interfaces/i-Product';
import { ProductstockService } from '../../../services/productstock/productstock.service';
import { NgxEditorModule } from 'ngx-editor';
import { Editor } from 'ngx-editor';
import { ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Image } from '../../../interfaces/i-Product';
import { NotificationComponent } from '../../notification/notification.component';
import { timeout } from 'rxjs';
import { EditProductStockComponent } from '../edit-product-stock/edit-product-stock.component';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    NzSelectModule,
    MatTableModule,
    NgxEditorModule,
    NotificationComponent,
    EditProductStockComponent,
    RouterLink 
  ],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailProductComponent implements OnInit {
  editor!: Editor;
  idProduct: number = 0;
  Product: IProduct = {
    idproduct: 0,
    idbrand: 0,
    idkindproduct: 0,
    nameproduct: '',
    kindproduct: '',
    namebrand: '',
    description: '',
    price: 0,
    available: 0,
    deprice: 0,
    date: new Date(),
    image: null,
    productstocks: null,
  };
  Brands: IBrand[] = [];
  Kinds: Ikindproduct[] = [];
  selectedImagesList: File[] = [];
  idselectedImagesList: number[] = [];
  productStocks: IProductStock[] = [];
  newSize: string = '';
  newColor: string = '';
  newQuantity: number = 0;
  checkStock: number = 0;
  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.destroy();
    }
  }
  constructor(
    private BrandsService: BrandService,
    private kindsService: KindproductService,
    private imageService: ImageService,
    private productService: ProductService,
    private productstock: ProductstockService,
    private cdr: ChangeDetectorRef,
    private routes: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.editor = new Editor();
    this.getAllBrand();
    this.getAllKind();
    this.routes.params.forEach((params) => {
      this.idProduct = +params['idproduct'];
      if (this.idProduct != null && this.idProduct !== 0) {
        this.getIdProduct(this.idProduct);
      }
    });
  }
  addProductStock(): void {
    if (this.newSize && this.newColor && this.newQuantity) {
      // this.checkStock = true;
      const newProduct: IProductStock = {
        id: 0, // Giả sử Id tự đ��ng tăng
        namesize: this.newSize,
        namecolor: this.newColor,
        quatity: this.newQuantity,
      };
      this.productStocks.push(newProduct);
      this.newSize = '';
      this.newColor = '';
      this.newQuantity = 0;
    }
  }

  removeProductStock(product: IProductStock): void {
    const index = this.productStocks.indexOf(product);
    if (index >= 0) {
      this.productStocks.splice(index, 1);
    }
  }
  onImageSelect(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    if (files) {
      this.selectedImagesList.push(...Array.from(files));
    }
  }
  getImageUrl(file: File): string {
    if (typeof file === 'string') {
      return file;
    }
    return URL.createObjectURL(file);
  }

  removeImage(idImage: number, index: number): void {
    if (idImage) {
      this.productService.deleteImage(idImage).subscribe((data) => {
        this.message = 'Xóa thành công';
        this.selectedImagesList.splice(index, 1);
        setTimeout(() => {
          this.message = '';
        }, 2000);
      });
    } else {
      this.selectedImagesList.splice(index, 1);
    }
  }
  getAllBrand() {
    this.BrandsService.getAllBrands().subscribe((data) => {
      this.Brands = data;
    });
  }
  getAllKind() {
    this.kindsService.getKindproducts().subscribe((data) => {
      this.Kinds = data;
    });
  }

  getIdProduct(idProduct: number) {
    this.productService.getProductById(idProduct).subscribe({
      next: (product) => {
        this.Product = product;
        this.productStocks = product.productstocks;
        if (this.Product.image) {
          this.Product.image.forEach((img, index) => {
            if (img && img.image4) {
              this.selectedImagesList.push(img.image4);
              this.idselectedImagesList.push(img.id); // Lưu id ảnh để xóa sau khi cập nhật sản phẩm
            }
          });
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('error', err);
      },
    });
  }
  message: string = '';
  updateProduct() {
    const formData = new FormData();
    formData.append('Idproduct', this.Product.idproduct.toString());
    formData.append('Idbrand', this.Product.idbrand.toString());
    formData.append('Idkindproduct', this.Product.idkindproduct.toString());
    formData.append('Nameproduct', this.Product.nameproduct);
    formData.append('Kindproduct', this.Product.kindproduct);
    formData.append('Namebrand', this.Product.namebrand);
    formData.append('Description', this.Product.description);
    formData.append('Price', this.Product.price.toString());
    formData.append('Available', this.Product.available.toString());
    formData.append('Deprice', this.Product.deprice.toString());
    if (!(this.Product.date instanceof Date)) {
      // If it's a string or any other format, convert it to a Date object
      this.Product.date = new Date(this.Product.date);
    }
    const formattedDate = this.Product.date.toISOString().split('T')[0];
    formData.append('Date', formattedDate);
    this.selectedImagesList.forEach((file) => {
      formData.append('Image', file);
    });
    this.productService.updateProduct(formData, this.idProduct).subscribe({
      next: () => {
        for (let i = 0; i < this.productStocks.length; ) {
          this.productStocks[i].idproduct = this.idProduct;
          console.log(this.productStocks);
          if (this.productStocks[i].id === 0) {
            this.productstock.insertProductStock(this.productStocks[i]).subscribe({
              next: (res: any) => {},
              error: (error: any) => {
                console.error(error);
              },
            }); 
          }
        }
        this.message = 'Cập nhật thành công';
        setTimeout(() => {
          this.message = '';
        }, 2000);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('error', err);
      },
    });
  }
  idProductStocks: number = 0;
  openModalStock(idProductStock: number): void {
    this.idProductStocks = idProductStock;
  }
}
