import { Component } from '@angular/core';
import { ManagerHeaderComponent } from '../manager-header/manager-header.component';
import { MatTableDataSource } from '@angular/material/table';
import { IBrand } from '../../../interfaces/i-Brand';
import { BrandService } from '../../../services/brand/brand.service';
import { Ikindproduct } from '../../../interfaces/i-KindProduct';
import { KindproductService } from '../../../services/kindproduct/kindproduct.service';
import { MatTableModule } from '@angular/material/table';
import { PagingComponent } from '../../components/paging/paging.component';
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { NotificationComponent } from '../../notification/notification.component';
import { ConfirmComponent } from '../../components/confirm/confirm.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddBrandComponent } from '../add-brand/add-brand.component';
import { AddKindProductComponent } from '../add-kind-product/add-kind-product.component';
@Component({
  selector: 'app-brand-manager',
  standalone: true,
  imports: [
    ManagerHeaderComponent,
    MatTableModule,
    PagingComponent,
    MatMenu,
    CommonModule,
    FormsModule,
    MatMenuTrigger,
    MatMenuModule,
    NotificationComponent,
    ConfirmComponent,
    AddBrandComponent,
    AddKindProductComponent,
  ],
  templateUrl: './brand-manager.component.html',
  styleUrl: './brand-manager.component.css',
})
export class BrandManagerComponent {
  Math = Math;
  displayedColumns: string[] = ['Mã nhãn hàng', 'Hình ảnh', 'Tên', 'Hành động'];
  displayedColumnsKind: string[] = [
    'Mã loại sản phẩm',
    'Hình ảnh',
    'Tên',
    'Hành động',
  ];
  dataSource: MatTableDataSource<IBrand> = new MatTableDataSource<IBrand>();
  datakindProduct: MatTableDataSource<Ikindproduct> =
    new MatTableDataSource<Ikindproduct>();
  brand: IBrand[] = [];
  kindProduct: Ikindproduct[] = [];
  pageindexBrand: number = 1;
  pageindexKindProduct: number = 1;
  pageSizeBrand: number = 7;
  pageSizeKindProduct: number = 7;
  totalBrand: number = 0;
  totalKindProduct: number = 0;
  constructor(
    private brandService: BrandService,
    private kindProductService: KindproductService
  ) {
    this.getBrand();
    this.getKindProduct();
    this.gettotal();
  }
  gettotal() {
    this.kindProductService.getKindproducts().subscribe((total) => {
      this.totalKindProduct = total.length;
    });
    this.brandService.getAllBrands().subscribe((total) => {
      this.totalBrand = total.length;
    });
  }
  getBrand() {
    this.brandService
      .getBrandPage(this.pageindexBrand, this.pageSizeBrand)
      .subscribe((data) => {
        this.dataSource.data = data;
      });
  }
  getKindProduct() {
    this.kindProductService
      .getKindproductPage(this.pageindexKindProduct, this.pageSizeKindProduct)
      .subscribe((data) => {
        this.datakindProduct.data = data;
      });
  }
  onPageChanged(newpageindex: number) {
    this.pageindexKindProduct = newpageindex;
    this.getKindProduct();
  }
  onPageChangedBrand(newpageindex: number) {
    this.pageindexBrand = newpageindex;
    this.getBrand();
  }
  idBrandEdit: number = 0;
  editBrand(idBrand: number) {
    this.idBrandEdit = idBrand;
    this.getBrand();
  }
  idKindProductEdit: number = 0;
  editKindProduct(idKindProduct: number) {
    this.idKindProductEdit = idKindProduct;
    this.getKindProduct();
  }
  message: string = '';
  notification: boolean = false;
  notificationKindProduct: boolean = false;
  idBrandDelete: number = 0;
  idKindProduct: number = 0;
  removeKindProduct() {
    this.notificationKindProduct = false;
    this.kindProductService.deleteKindProduct(this.idKindProduct).subscribe({
      next: () => {
        this.idKindProduct = 0;
        this.message = 'Đã xóa thành công.';
        setTimeout(() => {
          this.getKindProduct();
          this.gettotal();
          this.message = '';
        }, 2000);
      },
      error: (err) => {
        this.message = 'Loại sản phẩm đã được nhập sản phẩm';
        setTimeout(() => {
          this.message = '';
        }, 2000);
      },
    });
  }
  removeBrand() {
    this.notification = false;
    this.brandService.deleteBrand(this.idBrandDelete).subscribe({
      next: () => {
        this.idBrandDelete = 0;
        this.message = 'Đã xóa thành công.';
        this.gettotal();
        setTimeout(() => {
          this.message = '';
          this.getBrand();
        }, 2000);
      },
      error: (err) => {
        this.message = 'Nhãn hàng đã được nhập sản phẩm';
        setTimeout(() => {
          this.message = '';
        }, 2000);
      },
    });
  }

  deleteBrand(idBrand: number) {
    this.idBrandDelete = idBrand;
    this.notification = true;
  }
  deleteKindProduct(id: number) {
    this.idKindProduct = id;
    this.notificationKindProduct = true;
  }
}
