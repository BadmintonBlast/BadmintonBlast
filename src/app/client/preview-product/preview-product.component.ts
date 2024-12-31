import { Component, Input } from '@angular/core';
import { PreviewService } from '../../../services/preview/preview.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IPreview } from '../../../interfaces/i-Preview';
import { PagingComponent } from '../../components/paging/paging.component';
import { IProduct } from '../../../interfaces/i-Product';
import { MatIcon } from '@angular/material/icon';
import { CustomersService } from '../../../services/customer/customers.service';
@Component({
  selector: 'app-preview-product',
  standalone: true,
  imports: [CommonModule, FormsModule, PagingComponent, MatIcon],
  templateUrl: './preview-product.component.html',
  styleUrl: './preview-product.component.css',
})
export class PreviewProductComponent {
  Math = Math;
  previews: IPreview[] = [];
  pageIndex: number = 1;
  pageSize: number = 5;
  totalPreviews: number = 0;
  @Input() IdProduct: number = 0;

  constructor(
    private previewService: PreviewService,
    private customerService: CustomersService
  ) {}

  ngOnInit() {
    this.loadPreviews();
  }
  nameCustomer: { [idCustomer: number]: string } = {}; 
  loadPreviews() {
    const request = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      IdProduct: this.IdProduct,
    };

    this.previewService.getPreviews(request).subscribe((data) => {
      this.previews = data;
      this.previews.forEach((preview) => {
        this.customerService.getCustomerId(preview.idcustomer).subscribe((data) => {
          this.nameCustomer[preview.idcustomer] = data.namecustomer;
        });
      })
    });
    this.previewService.getIdPreview(this.IdProduct).subscribe((data) => {
      this.totalPreviews = data.length;
    });
  }
  onPageChanged(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.loadPreviews();
  }
  getStars(rating: number) {
    const fullStars = Math.floor(rating); // Số sao đầy
    const hasHalfStar = rating % 1 !== 0; // Có sao nửa hay không
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Số sao rỗng

    return {
      fullStars: Array(fullStars),
      hasHalfStar,
      emptyStars: Array(emptyStars),
    };
  }
  getIdCustomer(idCustomer: number) {
    this.customerService.getCustomerId(idCustomer).subscribe((data) => {
      return data.namecustomer;
    });
    return;
  }
}
