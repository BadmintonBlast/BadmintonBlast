import { Component } from '@angular/core';
import { BillService } from '../../../services/bill/bill.service';
import { StaticalResultService } from '../../../services/StatiscalResult/statical-result.service';
import { FormsModule } from '@angular/forms';
import { TableUtil } from '../managerCustomer/tableUtil';
import { IStatisticalResult } from '../../../interfaces/i-StatiscalResult';
import { IProductSalesDTO } from '../../../interfaces/i-StatiscalResult';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product/product.service';
import { IProductStatic } from '../../../interfaces/i-Product';
import { MatTableDataSource } from '@angular/material/table';
import {IStatisticalInvoice} from '../../../interfaces/i-StatiscalResult';
import { CustomersService } from '../../../services/customer/customers.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'], // Sửa thành styleUrls
})
export class DashboardComponent {
  dateStart: string = this.formatDate(new Date()); // 1 tháng 11 năm 2024
  dateEnd: string = this.formatDate(new Date()); // 30 tháng 11 năm 2024
  Statistical: IStatisticalResult; // T��ng doanh thu
  StaticalProduct: IProductSalesDTO;
  statisticalReservation:IStatisticalInvoice;
  totalProduct: number = 0;
  totalCustomer:number=0;
  Product : MatTableDataSource<IProductStatic> =
  new MatTableDataSource<IProductStatic>();
  dataSource: MatTableDataSource<IProductStatic> =
  new MatTableDataSource<IProductStatic>();
  constructor(
    private billService: BillService,
    private staticalResultService: StaticalResultService,
    private productService: ProductService,
    private customerService: CustomersService,
  ) {
    // Gọi hàm getStatical với dateStart và dateEnd
   
    
  }
  ngOnInit(): void {
    this.getStatical(this.dateStart, this.dateEnd);
    this.customerService.getTotalCustomers('').subscribe((data)=>{
      this.totalCustomer=data
    })
  }
  // Hàm định dạng ngày theo "yyyy-MM-dd"
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Lấy thống kê hóa đơn
  getStatical(dateStart: string, dateEnd: string): void {
    this.totalProduct=0;
    this.Product.data=[];
    this.staticalResultService.getBillStatistics(dateStart, dateEnd).subscribe({
      next: (data: any) => {
        this.Statistical = data;
      }
    
    });
    this.staticalResultService.getInvoiceStatistics(dateStart, dateEnd).subscribe({
      next: (data: any) => {
        this.statisticalReservation = data;
      }
    });
    this.staticalResultService
      .getTotalUniqueProducts(dateStart, dateEnd)
      .subscribe({
        next: (data: any) => {
          this.StaticalProduct = data;
          this.totalProduct=data.length;
          for (let i = 0; i < data.length; i++) {
            
            this.productService.getProductById(data[i].productId).subscribe({
              next: (product: any) => {
                this.Product.data.push({
                  idproduct: product.idproduct,
                  nameproduct: product.nameproduct,
                  price: product.price,
                  sale: product.sale,
                  totalProduct: data[i].totalQuantity,
                  totalMoney: data[i].totalAmount,
                });
              },
              error: (error: any) => {
                console.error('Error :', error);
              },
            });
          }
        },
        error: (error: any) => {
          console.error('Error :', error);
        },
      });
     
  }
  exportCustomerArrayToExcel() {
    // Lọc dữ liệu và loại bỏ trường passwordHash
    const staticalData: Partial<IProductStatic>[] = this.Product.data.map(
      ({idproduct,nameproduct,price,totalProduct,totalMoney}) => ({
      idproduct,nameproduct,price,totalProduct,totalMoney
      })
    );
    TableUtil.exportArrayToExcel(staticalData, 'thongke');
  }

  onchange() {
    this.getStatical(this.dateStart, this.dateEnd);
  }
}
