import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef,Output, EventEmitter, Input,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductstockService } from '../../../services/productstock/productstock.service';
import { IProductStock } from '../../../interfaces/i-ProductStock';

@Component({
  selector: 'app-edit-product-stock',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-product-stock.component.html',
  styleUrl: './edit-product-stock.component.css',
})
export class EditProductStockComponent implements OnInit {
  @Input() idProductStock: number = 0;
  @Output() statusProductStock: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  productData: IProductStock = {
    id: 0,
    idproduct: 0,
    namecolor: '',
    namesize: '',
    quatity: 0,
  };
  constructor(private productStockService: ProductstockService,private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    if (this.idProductStock) {
      this.productStockService
        .getIdProductStock(this.idProductStock)
        .subscribe((data) => {
          console.log(data);
          this.productData = data;
          this.cdr.detectChanges(); 
        });
    }
  }

  onSubmit(): void {
    this.productStockService
      .updateProductStock(this.productData)
      .subscribe(() => {
        this.closeModal();
      });
  }

  closeModal(): void {
    this.statusProductStock.emit();
  }
}
