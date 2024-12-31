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
@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [FormsModule, MatTableModule, MatSelectModule, MatMenuModule,MatMenu,CommonModule,ManagerHeaderComponent],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
})
export class InvoiceComponent {
  constructor(private invoiceService: StaticalResultService) {
    this.getInvoice()
  }
  dataSource: MatTableDataSource<IInvoice> = new MatTableDataSource<IInvoice>();
  pageIndex: number = 1;
  pageSize: number = 10;
  dateStart: string | null = '';
  dateEnd: string | null = '';
  customerName: string | null = '';
    displayedColumns: string[] = [
      'Mã hóa đơn',
      'Mã khách hàng',
      'Số điện thoại',
      'Tổng tiền',
      'Ngày đặt',
      'Trạng thái',
      'Phương thức thanh toán',
      'Hành động',
    ];
  getInvoice() {
    this.invoiceService
      .getInvoices(
        this.pageIndex,
        this.pageSize,
        this.dateStart,
        this.dateEnd,
        this.customerName
      )
      .subscribe((data) => {
        this.dataSource.data = data;
      });
  }
  // exportProductArrayToExcel() {
  //   const productData = this.dataSource.flatMap(invoice =>
  //     invoice.reservations.map(reservation => ({
  //       'Mã hóa đơn': invoice.idInvoice,
  //       'Ngày đặt': invoice.reservationdate,
  //       'Tổng tiền': invoice.totalamount,
  //       'Tên sân': reservation.namefield,
  //       'Thời gian bắt đầu': reservation.starttimerates,
  //       'Thời gian kết thúc': reservation.endtimerates,
  //       'Trạng thái sân': reservation.fieldstatus,
  //       'Slots còn thiếu': reservation.missingSlots ? reservation.missingSlots.replace(/<\/?[^>]+(>|$)/g, '') : '',
  //     }))
  //   );
  // }  
}
