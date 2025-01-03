import { Component } from '@angular/core';
import { StaticalResultService } from '../../../services/StatiscalResult/statical-result.service';
import { IInvoice } from '../../../interfaces/i-Reservation';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { ManagerHeaderComponent } from '../manager-header/manager-header.component';
import { PagingComponent } from '../../components/paging/paging.component';
import { TableUtil } from '../managerCustomer/tableUtil';
@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [
    FormsModule,
    PagingComponent,
    MatTableModule,
    MatSelectModule,
    MatMenuModule,
    MatMenu,
    CommonModule,
    ManagerHeaderComponent,
  ],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class InvoiceComponent {
  constructor(private invoiceService: StaticalResultService) {
    this.getInvoices();
  }
  Math = Math;
  // Biến dùng để quản lý dữ liệu
  dataSource: MatTableDataSource<IInvoice> = new MatTableDataSource<IInvoice>();
  pageIndex: number = 1;
  pageSize: number = 7;
  dateStart: string | null = '';
  dateEnd: string | null = '';
  keyword: string | null = '';
  totalInvoice: number = 0; // Tổng số hóa đơn để tính toán số trang

  displayedColumns = ['idInvoice', 'idcustomer','customername', 'totalAmount', 'reservationDate', 'status', 'actions'];


  // Hàm lấy danh sách hóa đơn
  getInvoices() {
    this.invoiceService
      .getInvoices(
        this.pageIndex,
        this.pageSize,
        this.dateStart,
        this.dateEnd,
        this.keyword
      )
      .subscribe((data) => {
        this.dataSource.data = data; // Giả định API trả về { items, total }
      });
    this.invoiceService.getInvoiceTotal( this.dateStart,
      this.dateEnd,
      this.keyword).subscribe((data) => {
      this.totalInvoice = data;
    });
  }
  search(key: string) {
    this.keyword = key;
    this.getInvoices(); // Tải lại dữ liệu với từ khóa mới
  }
  // Hàm xử lý thay đổi trang
  onPageChanged(event: number) {
    this.pageIndex = event;
    this.getInvoices();
  }
  exportInvoiceArrayToExcel(): void {
    const invoiceData: Partial<IInvoice>[] = this.dataSource.data.map(
      (invoice: IInvoice) => ({
        idInvoice: invoice.idInvoice || 0,
        idcustomer: invoice.idcustomer || 0,
        reservationdate: invoice.reservationdate,
        customername: invoice.customername,
        customerphone: invoice.customerphone || 'Trống', // Nếu không có số điện thoại, hiển thị "Trống"
        totalamount: invoice.totalamount || 0, // Đảm bảo totalamount là số
        status: invoice.status || 'Không xác định', // Nếu không có trạng thái, hiển thị "Không xác định"
        paymentmethod: invoice.paymentmethod || 'N/A', // Nếu không có phương thức thanh toán, hiển thị "N/A"
        transactioncode: invoice.transactioncode || 'Không có mã', // Nếu không có mã giao dịch, hiển thị "Không có mã"
      })
    );
    TableUtil.exportArrayToExcel(invoiceData, 'Invoice');
  }
  
  // Hàm xử lý lọc
  onFilter() {
    this.pageIndex = 1; // Reset về trang đầu tiên khi lọc
    this.getInvoices();
  }
}
