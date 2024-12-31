import { Component, EventEmitter, Output, Input } from '@angular/core';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { DetailImageComponent } from '../../detail-image/detail-image.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { IProductStock } from '../../../interfaces/i-ProductStock';
import { MatTableModule } from '@angular/material/table';
import { IBrand } from '../../../interfaces/i-Brand';
import { PagingComponent } from '../paging/paging.component';
import { BrandService } from '../../../services/brand/brand.service';
import { KindproductService } from '../../../services/kindproduct/kindproduct.service';
import { Ikindproduct } from '../../../interfaces/i-KindProduct';
import { ImageService } from '../../../services/image/image.service';
import { ProductService } from '../../../services/product/product.service';
import { IProduct } from '../../../interfaces/i-Product';
import { ProductstockService } from '../../../services/productstock/productstock.service';
@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DetailImageComponent,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    DetailImageComponent,
    NzSelectModule,
    MatTableModule,
    PagingComponent,
  ],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent {
  Math = Math;
  @Input() idProduct: number | null = null;
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
    image: [],
    productstocks: [],

  };
  
  @Output() selectedImages: EventEmitter<string[]> = new EventEmitter<
    string[]
  >();
  Brands: IBrand[] = [];
  Kinds: Ikindproduct[] = [];
  allImages: boolean = false;
  @Output() statusAddProduct: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  selectedImagesList: string[] = [];
  sizes: string[] = []; // Mảng lưu danh sách kích thước
  productName: string = '';
  productDescription: string = '';
  selectedCategory: string = '';
  pageSize: number = 6; // Số lượng sản phẩm trên mỗi trang
  currentPage: number = 1; // Trang hiện tại
  newSize: string = '';
  newColor: string = '';
  newQuantity: number = 0;
  displayedColumns: string[] = ['size', 'color', 'quantity', 'action'];
  checkStock: boolean = false;
  productStocks: IProductStock[] = [];

  constructor(
    private BrandsService: BrandService,
    private kindsService: KindproductService,
    private imageService: ImageService,
    private productService: ProductService,
    private productstock:ProductstockService
  ) {}
  ngOnInit() {
    this.getAllBrand();
    this.getAllKind();
    console.log(this.idProduct);
    if (this.idProduct) {
      this.getIdProduct(this.idProduct);
    }
  }

  getIdProduct(idProduct: number) {
    this.productService.getProductById(idProduct).subscribe({
      next: (product) => {
        this.Product = product; // Gán sản phẩm đã lấy được vào thuộc tính
        // Khởi tạo selectedImagesList nếu chưa có
        if (!this.selectedImagesList) {
          this.selectedImagesList = [];
        }
        // Trích xuất hình ảnh từ sản phẩm
        this.Product.image.forEach((img) => {
          if (img.image4) {
            this.selectedImagesList.push(img.image4); // Đưa hình ảnh hợp lệ vào danh sách
          }
        });
        // Thêm vào productStocks
        this.Product.productstocks.forEach((stock) => {
          this.productStocks.push({
            id:stock.id,
            idproduct: stock.idproduct,
            namecolor: stock.namecolor,
            namesize: stock.namesize,
            quatity: stock.quatity,
          });
        });
        if (this.productStocks) {
          this.checkStock = true;
        }
      },
      error: (err) => {
        console.error('Error retrieving product:', err);
        // Xử lý lỗi, ví dụ như hiển thị thông báo
      },
    });
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
  addProductStock(): void {
    if (this.newSize && this.newColor && this.newQuantity) {
      this.checkStock = true;
      const newProduct: IProductStock = {
        id: 0, // Giả sử Id tự đ��ng tăng
        idproduct: this.productStocks.length + 1, // Giả sử Id tự động tăng
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
  get paginatedProductStocks() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.productStocks.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number) {
    this.currentPage = page;
  }
  removeProductStock(product: IProductStock): void {
    const index = this.productStocks.indexOf(product);
    if (index >= 0) {
      this.productStocks.splice(index, 1);
    }
  }

  onAddCategory() {}
  onAddBrand() {}
  onImageSelect(event: any): void {
    const files = event.target.files;
    const desiredWidth = 800;
    const desiredHeight = 800;

    if (files) {
      for (let file of files) {
        this.imageService
          .resizeImage(file, desiredWidth, desiredHeight)
          .then((resizedImageURL) => {
            this.selectedImagesList.push(resizedImageURL);
            this.selectedImages.emit(this.selectedImagesList); // Emit the updated list
          });
      }
    }
  }

  allImage() {
    this.allImages = true;
  }
  closeAddproduct() {
    this.statusAddProduct.emit(false);
  }
  updateBrandName() {
    const selectedBrand = this.Brands.find(brand => brand.idbrand === this.Product.idbrand);
    this.Product.namebrand = selectedBrand ? selectedBrand.namebrand : '';
  }
  updateKindProductName() {
    const selectedKind = this.Kinds.find(kind => kind.idkindproduct === this.Product.idkindproduct);
    this.Product.kindproduct = selectedKind ? selectedKind.nameproduct : '';
  }
  
  onAddProduct() {
    if (this.validateProduct()) {
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
  
      this.selectedImagesList.forEach(image => {
        formData.append('Image', image);
      });
  
      this.productService.addProduct(formData).subscribe(response => {
        console.log('Product added successfully', response);
  
        // Sau khi sản phẩm được thêm thành công, thêm các kho sản phẩm
        this.productStocks.forEach(stock => {
          this.productstock.insertProductStock(stock).subscribe(stockResponse => {
            console.log('Product stock added successfully', stockResponse);
          }, stockError => {
            console.error('Error adding product stock', stockError);
          });
        });
  
        this.resetForm();
      }, error => {
        console.error('Error adding product', error);
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }
  

  validateProduct() {
    return this.Product.nameproduct && this.Product.price > 0 && this.Product.available >= 0;
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
      image: [],
      productstocks: [],
    };
  
    this.selectedImagesList = [];
    this.productStocks = []; // Reset lại danh sách kho sản phẩm
  }
  
}
