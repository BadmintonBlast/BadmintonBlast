import { Component } from '@angular/core';
import { IProduct } from '../../../interfaces/i-Product';
import { ProductService } from '../../../services/product/product.service';
import { TableUtil } from '../managerCustomer/tableUtil';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { PagingComponent } from '../../components/paging/paging.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AddProductComponent } from '../add-product/add-product.component';
import { NotificationComponent } from '../../notification/notification.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { DetailProductComponent } from '../detail-product/detail-product.component';
import { ManagerHeaderComponent } from '../manager-header/manager-header.component';
import { ConfirmComponent } from '../../components/confirm/confirm.component';

@Component({
  selector: 'app-manager-product',
  standalone: true,
  imports: [
    DetailProductComponent,
    CommonModule,
    PagingComponent,
    MatTableModule,
    MatFormFieldModule,
    FormsModule,
    AddProductComponent,
    MatSelectModule,
    MatOptionModule,
    MatMenuModule,
    MatMenu,
    ManagerHeaderComponent,
    ConfirmComponent,
    NotificationComponent,
  ],
  templateUrl: './manager-product.component.html',
  styleUrls: ['./manager-product.component.css'],
})
export class ManagerProductComponent {
  Math = Math;
  displayedColumns: string[] = [
    'Tên',
    'Giá',
    'Thương hiệu',
    'Trạng thái',
    'Giảm giá',
    'Ngày nhập',
    'Hành động',
  ];
  dataSource: MatTableDataSource<IProduct> = new MatTableDataSource<IProduct>();
  totalProducts: number = 0;
  keyword: string = '';
  pageIndex: number = 1;
  pageSize: number = 10; // Default page size
  allImages: boolean = false;
  statusAddProduct: boolean = false;
  statusDetailProduct: boolean = false;
  notification = false;
  notificationMessage: string = '';
  idProduct: number = 0;

  constructor(
    private productService: ProductService,
    private route: Router,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.idProduct = params['idproduct'];
    });
    if (this.idProduct) {
      this.statusDetailProduct = true;
      this.statusAddProduct = false;
    } else {
      this.getAllProducts();
    }
  }

  getAllProducts(): void {
    this.productService
      .getProductsAsync(
        this.keyword,
        null,
        this.pageIndex,
        this.pageSize,
        0,
        0,
        0,
        0
      )
      .subscribe((data) => {
        this.dataSource.data = data; // Giả sử data trả về có thuộc tính products
      });

    this.productService
      .getTotalProduct(this.keyword, 0, 0, 0, 0, 0)
      .subscribe((total) => {
        this.totalProducts = total;
      });
  }

  onPageChanged(newPageIndex: number): void {
    this.pageIndex = newPageIndex;
    this.getAllProducts();
  }
  search(key: string): void {
    this.keyword = key;

    this.getAllProducts();
  }

  exportProductArrayToExcel() {
    const productData: Partial<IProduct>[] = this.dataSource.data.map(
      ({ idproduct, nameproduct, price, available }) => ({
        idproduct,
        nameproduct,
        price,
        available,
      })
    );

    TableUtil.exportArrayToExcel(productData, 'Product');
  }

  editProduct(idproduct: number): void {
    this.route.navigate(['/menu/sanpham', idproduct]);

    this.statusDetailProduct = true;
  }

  openAddProduct() {
    this.statusAddProduct = true;
  }
  idProductDelete: number = 0;
  // Function to close the add product component
  message: string = '';
  removeProduct() {
    console.log(this.idProductDelete);
    this.notification=false;
    this.productService.deleteProductById(this.idProductDelete).subscribe({
      next: (result) => {
        // Xử lý thành công
        this.idProductDelete = 0;
        this.message = 'Sản phẩm đã được xóa thành công!';

        this.getAllProducts();
        setTimeout(() => {
          this.message = ''; // Xóa thông báo sau 2 giây
        }, 2000);
      },
      error: (err) => {
        console.log(err);
        this.message = 'Sản phẩm đã được đặt mua, nên thao tác xóa không được phép.';
        setTimeout(() => {
          this.message = ''; // Xóa thông báo sau 2 giây
        }, 2000);
      }
    });
   
  }
  
  

  showNotification(idProduct: number) {
    this.idProductDelete = idProduct;
    this.notification = true;
  }
}
