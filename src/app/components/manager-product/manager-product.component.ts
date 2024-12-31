import { Component} from '@angular/core';
import { IProduct } from '../../../interfaces/i-Product';
import { ProductService } from '../../../services/product/product.service';
import { TableUtil } from '../managerCustomer/tableUtil';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { PagingComponent } from '../paging/paging.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AddProductComponent } from '../add-product/add-product.component';
import { NotificationComponent } from '../../notification/notification.component';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatMenuModule,MatMenu } from '@angular/material/menu';
@Component({
  selector: 'app-manager-product',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CommonModule,
    PagingComponent,
    MatTableModule,
    MatFormFieldModule,
    FormsModule,
    AddProductComponent,
    NotificationComponent, 
    MatSelectModule,
    MatOptionModule,
    MatMenuModule,
    MatMenu
  ],
  templateUrl: './manager-product.component.html',
  styleUrls: ['../managerCustomer/manager-customer.component.css'],
})
export class ManagerProductComponent {
  Math = Math; // Để có thể sử dụng Math trong template
  displayedColumns: string[] = [
    'idproduct',
    'nameproduct',
    'price',
    'namebrand',
    'available',
    'actions',
  ];
  dataSource: MatTableDataSource<IProduct> = new MatTableDataSource<IProduct>();
  totalProducts: number = 0;
  keyword: string = '';
  pageIndex: number = 1;
  pageSize: number = 10; // Default page size
  allImages: boolean = false;
  statusAddProduct: boolean = false;
  notification = false;
  notificationMessage: string = '';
  idProduct!:number;

  constructor(private productService: ProductService,private router:Router) {}

  ngOnInit(): void {
    this.getAllProducts(); // Load products when component initializes
  }

  getAllProducts(): void {
    this.productService
      .getProductsAsync(this.keyword, null, this.pageIndex, this.pageSize)
      .subscribe((data) => {
        this.dataSource.data = data; // Giả sử data trả về có thuộc tính products
      });

    this.productService.getTotalProduct(this.keyword,0).subscribe((total) => {
      this.totalProducts = total;
    });
  }

  onPageChanged(newPageIndex: number): void {
    this.pageIndex = newPageIndex;
    this.getAllProducts(); // Fetch products for the new page
  }
  onSearch(): void {
    this.pageIndex = 1; // Reset to the first page when searching
    this.getAllProducts();
  }

  exportProductArrayToExcel() {
    // Lọc dữ liệu và loại bỏ trường passwordHash nếu có
    const productData: Partial<IProduct>[] = this.dataSource.data.map(
      ({ idproduct, nameproduct, price, available }) => ({
        idproduct,
        nameproduct,
        price,
        available,
      })
    );

    console.log(productData); // In ra dữ liệu để kiểm tra
    TableUtil.exportArrayToExcel(productData, 'Product');
  }

  editProduct(idproduct: number): void {
    console.log(idproduct)
    this.idProduct=idproduct;
    this.statusAddProduct=true;

  }

  openAddProduct() {
    this.statusAddProduct = true; // Set to true to show the add product component
  }

  // Function to close the add product component
  handleAddProductStatus(status: boolean): void {
    this.statusAddProduct = status; // Cập nhật trạng thái
  }

  showNotification() {
    this.notificationMessage = 'This is a dynamic notification!';
    this.notification = true;

    // Tắt thông báo sau 3 giây
    setTimeout(() => {
      this.notification = false;
    }, 3000);
  }
}
