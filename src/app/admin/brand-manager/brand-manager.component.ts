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
@Component({
  selector: 'app-brand-manager',
  standalone: true,
  imports: [
    ManagerHeaderComponent,
    MatTableModule,
    PagingComponent,
    MatMenu,
    MatMenuTrigger,
    MatMenuModule,
  ],
  templateUrl: './brand-manager.component.html',
  styleUrl: './brand-manager.component.css',
})
export class BrandManagerComponent {
  Math = Math;
  displayedColumns: string[] = ['Mã nhãn hàng', 'Hình ảnh', 'Tên','Hành động'];
  displayedColumnsKind: string[] = ['Mã loại sản phẩm', 'Hình ảnh', 'Tên','Hành động'];
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
  editBrand(idBrand:number)
  {

  }
  deleteBrand(idBrand:number)
  {
    this.brandService.deleteBrand(idBrand).subscribe(() => {
      this.getBrand();
    });
  }
}
