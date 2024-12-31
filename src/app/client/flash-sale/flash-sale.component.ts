import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule cho *ngFor
import { ProductService } from '../../../services/product/product.service';
import { IProduct } from '../../../interfaces/i-Product';
import { StaticalResultService } from '../../../services/StatiscalResult/statical-result.service';
import { IProductSalesDTO } from '../../../interfaces/i-StatiscalResult';
import { SharedService } from '../../../services/Share.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-flash-sale',
  standalone: true, // Đây là component standalone
  imports: [CommonModule], // Import CommonModule
  templateUrl: './flash-sale.component.html',
  styleUrls: ['./flash-sale.component.css'],
})
export class FlashSaleComponent {
  // Implements OnInit
  products: IProduct[] = [];
  productSale: IProductSalesDTO[] = [];

  constructor(
    private productservice: ProductService,
    private staticalResult: StaticalResultService,
    private shareService: SharedService,
    private router: Router,
  ) {}
  ngOnInit() {
    this.productservice
      .getProductsAsync('', null, 1, 6, 1, 0, 0, 0)
      .subscribe((data) => {
        this.products = data;
      });
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

    name = this.shareService.removeDiacritics(name);
    this.router.navigate(['/chitietsanpham', id, encodeURIComponent(name)]);
  }
}
