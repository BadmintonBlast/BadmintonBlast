import {
  Component,
  EventEmitter,
  Output,
  OnDestroy,
  OnInit,
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
import { IProductInsert } from '../../../interfaces/i-Product';
import { ProductstockService } from '../../../services/productstock/productstock.service';
import { NgxEditorModule } from 'ngx-editor';
import { Editor } from 'ngx-editor';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddKindProductComponent } from '../add-kind-product/add-kind-product.component';
import { AddBrandComponent } from '../add-brand/add-brand.component';
import { EditProductStockComponent } from "../edit-product-stock/edit-product-stock.component";
@Component({
  selector: 'app-add-product',
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
    AddKindProductComponent,
    AddBrandComponent,
],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductComponent implements OnInit, OnDestroy {
  Math = Math;
  idProduct: number = 0;

  Product: IProductInsert = {
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
    image: [],
  };

  @Output() selectedImages: EventEmitter<File[]> = new EventEmitter<File[]>();
  Brands: IBrand[] = [];
  Kinds: Ikindproduct[] = [];
  allImages: boolean = false;
  @Output() statusAddProduct: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  selectedImagesList: File[] = [];
  sizes: string[] = []; // Mảng lưu danh sách kích thước
  productName: string = '';
  editor!: Editor;
  html = '';
  selectedCategory: string = '';
  pageSize: number = 6; // Số lượng sản phẩm trên mỗi trang
  currentPage: number = 1; // Trang hiện tại
  newSize: string = '';
  newColor: string = '';
  newQuantity: number = 0;
  displayedColumns: string[] = ['size', 'color', 'quantity', 'action'];
  checkStock: boolean = false;
  productStocks: IProductStock[] = [];
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
  ) {
    this.editor = new Editor();
    this.getAllBrand();
    this.getAllKind();
  }
  ngOnInit() {}

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
      // this.cdr.detectChanges();
      console.log('files: %d', this.selectedImagesList.length);
    }
  }

  // To display the image, use URL.createObjectURL()
  getImageUrl(file: File): string {
    return URL.createObjectURL(file);
  }
  removeImage(index: number): void {
    this.selectedImagesList.splice(index, 1);
  }
  closeAddproduct() {
    this.statusAddProduct.emit(false);
  }
  updateBrandName() {
    const selectedBrand = this.Brands.find(
      (brand) => brand.idbrand === this.Product.idbrand
    );
    this.Product.namebrand = selectedBrand ? selectedBrand.namebrand : '';
  }
  updateKindProductName() {
    const selectedKind = this.Kinds.find(
      (kind) => kind.idkindproduct === this.Product.idkindproduct
    );
    this.Product.kindproduct = selectedKind ? selectedKind.nameproduct : '';
  }

  onAddProduct() {
    if (this.validateProduct()) {
      const formData = new FormData();
      // Thêm dữ liệu sản phẩm vào FormData
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
      formData.append('Date', this.Product.date.toISOString().split('T')[0]);

      // Thêm từng file ảnh vào FormData
      this.selectedImagesList.forEach((file) => {
        formData.append('Image', file);
      });
      // Gọi API thêm sản phẩm
      this.productService.addProduct(formData).subscribe({
        next: (res: any) => {
          this.idProduct = res.idproduct;
          if (this.idProduct) {
            for (let i = 0; i < this.productStocks.length; ) {
              this.productStocks[i].idproduct = this.idProduct;
              console.log(this.productStocks[i]);
              this.productstock
                .insertProductStock(this.productStocks[i])
                .subscribe({
                  next: (res: any) => {},
                  error: (error: any) => {
                    console.error(error);
                  },
                });
              i++;
            }
            alert('Thêm sản phẩm thành công');
          }
        },
        error: (error: any) => {
          alert('Lỗi khi thêm sản phẩm');
          console.error(error);
        },
      });
    } else {
      alert('Vui lòng điền đầy đủ thông tin sản phẩm.');
    }
  }

  validateProduct() {
    return (
      this.Product.nameproduct &&
      this.Product.price > 0 &&
      (this.productStocks.length > 0 &&
      this.Product.idkindproduct !== 2)&& this.Product.description!==''&&
      this.Product.idbrand!==0&&this.selectedImagesList.length!=0
    );
  }

  resetForm() {
    this.Product = {
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
      image: [],
    };

    this.selectedImagesList = [];
    this.productStocks = [];
  }
  isModalOpen = false;
  isModalBrand = false;

  openModal(): void {
    this.isModalOpen = true;
  }
  openModalBrand(): void {
    this.isModalBrand = true;
  }
  
}
