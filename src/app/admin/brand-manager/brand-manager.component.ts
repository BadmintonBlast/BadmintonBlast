import { Component } from '@angular/core';
import { ManagerHeaderComponent } from '../manager-header/manager-header.component';
import { MatTableDataSource } from '@angular/material/table';
import { IBrand } from '../../../interfaces/i-Brand';
import { BrandService } from '../../../services/brand/brand.service';
import { Ikindproduct } from '../../../interfaces/i-KindProduct';
import { KindproductService } from '../../../services/kindproduct/kindproduct.service';
import { MatTableModule } from '@angular/material/table';
import { PagingComponent } from '../../components/paging/paging.component';
@Component({
  selector: 'app-brand-manager',
  standalone: true,
  imports: [ManagerHeaderComponent, MatTableModule, PagingComponent],
  templateUrl: './brand-manager.component.html',
  styleUrl: './brand-manager.component.css',
})
export class BrandManagerComponent {
  Math = Math;
  displayedColumns: string[] = ['Mã nhãn hàng', 'Hình ảnh', 'Tên'];
  displayedColumnsKind: string[] = ['Mã loại sản phẩm', 'Hình ảnh', 'Tên'];
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
  }

  getBrand() {
    this.brandService
      .getBrandPage(this.pageindexBrand, this.pageSizeBrand)
      .subscribe((data) => {
        this.dataSource.data = data;
      });
    this.brandService.getAllBrands().subscribe((total) => {
      this.totalBrand = total.length;
    });
    this.kindProductService
      .getKindproductPage(this.pageindexKindProduct, this.pageSizeKindProduct)
      .subscribe((data) => {
        this.datakindProduct.data = data;
      });
    this.kindProductService.getKindproducts().subscribe((total) => {
      this.totalBrand = total.length;
    });
  }
  onPageChanged(newpageindex: number) {
    this.pageindexKindProduct=newpageindex;
    this.getBrand();
  }
  onPageChangedBrand(newpageindex: number)
  {
    this.pageindexBrand=newpageindex;
    this.getBrand();
  }
}
