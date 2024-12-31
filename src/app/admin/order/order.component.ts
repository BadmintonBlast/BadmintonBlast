import { Component, OnInit } from '@angular/core';
import { IBill } from '../../../interfaces/i-Bill';
import { BillService } from '../../../services/bill/bill.service';
import { PagingComponent } from '../../components/paging/paging.component';
import { TableUtil } from '../managerCustomer/tableUtil';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { ManagerHeaderComponent } from '../manager-header/manager-header.component';
import { NotificationComponent } from '../../notification/notification.component';
import { timeout } from 'rxjs';
@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    PagingComponent,
    MatMenuModule,
    CommonModule,
    PagingComponent,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    MatMenuModule,
    MatMenu,
    ManagerHeaderComponent,
    NotificationComponent,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent {
  bills: IBill[] = [];
  keyword: string = '';
  pageSize: number = 9;
  pageIndex: number = 1;
  totalBills: number = 0;
  dateStart: string | null = '';
  dateEnd: string | null = '';
  status: number | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  Math = Math; // Để có thể sử dụng Math trong template
  showStatusSelection: boolean = false; // Biến điều khiển hiển thị khung
  selectedStatus: number | undefined = undefined; // Biến lưu trạng thái đã chọn
  dataSource: MatTableDataSource<IBill> = new MatTableDataSource<IBill>();
  displayedColumns: string[] = [
    'idbill',
    'namecustomer',
    'phone',
    'totalamount',
    'dateorder',
    'status',
    'pay',
    'actions',
  ];
  applyFilter() {
    if (this.dateStart && this.dateEnd) {
      // Kiểm tra logic hoặc gửi lên API
      if (this.dateStart > this.dateEnd) {
        alert('Ngày bắt đầu không thể lớn hơn ngày kết thúc!');
      } else {
        // Gửi request API hoặc thực hiện lọc dữ liệu
        console.log('Lọc dữ liệu từ:', this.dateStart, 'đến:', this.dateEnd);
      }
    } else {
      alert('Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc!');
    }
    this.loadBills(); // Tải lại dữ liệu với các tham số lọc mới
  }
  search(key: string) {
    this.keyword = key;
    this.loadBills(); // Tải lại dữ liệu với từ khóa mới
  }
  orderStatuses = [
    { code: null, description: 'Tất cả' },
    { code: 900, description: 'Chờ Xác Nhận' },
    { code: 901, description: 'Chờ Lấy Hàng' },
    { code: 902, description: 'Giao Thành Công' },
    { code: 903, description: 'Đã Lấy Hàng' },
    { code: 904, description: 'Đả Hủy' },
    { code: 905, description: 'Trả Hàng/Hoàn Tiền' },
  ];

  selectStatus(code: number | undefined) {
    this.selectedStatus = code;
    this.status = code;
    this.dateStart = null;
    this.dateEnd = null;
    this.loadBills();
  }
  getStatusColor(statusCode: number | null): string {
    switch (statusCode) {
      case 900:
        return '#FFD700'; // Gold
      case 901:
        return '#FF8C00'; // Dark Orange
      case 902:
        return '#00CED1'; // Dark Turquoise
      case 903:
        return '#4682B4'; // Steel Blue
      case 904:
        return '#32CD32'; // Lime Green
      case 905:
        return '#008000'; // Green
      default:
        return '#FFFFFF'; // Default to white
    }
  }

  filterByStatus(status: number | null) {
    this.selectedStatus = status;
  }
  trackByCode(index: number, status: any): number {
    return status.code;
  }

  confirmStatusChange() {
    this.showStatusSelection = !this.showStatusSelection; // Cập nhật biến chính thức
    this.status = this.selectedStatus;
    this.loadBills();
  }
  constructor(private billService: BillService) {}

  ngOnInit(): void {
    this.loadBills();
  }
  toggleSort() {
    this.showStatusSelection = !this.showStatusSelection;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.orderStatuses =
      this.sortDirection === 'asc'
        ? this.orderStatuses.sort((a, b) =>
            a.description.localeCompare(b.description)
          )
        : this.orderStatuses.sort((a, b) =>
            b.description.localeCompare(a.description)
          );
  }
  loadBills(): void {
    this.billService
      .getBills(
        this.pageIndex,
        this.pageSize,
        this.dateStart,
        this.dateEnd,
        this.status,
        this.keyword
      )
      .subscribe((data) => {
        this.bills = data;
        this.dataSource.data = this.bills; // Cập nhật dataSource
      });
    this.billService
      .getTotalBill(this.dateStart, this.dateEnd, this.status, this.keyword)
      .subscribe((total) => {
        this.totalBills = total;
      });
  }

  onPageChanged(page: number): void {
    this.pageIndex = page;
    this.loadBills();
  }

  editBill(id: number): void {
    // Logic xử lý khi người dùng bấm vào nút chi tiết hóa đơn
  }

  exportBillArrayToExcel(): void {
    const customerData: Partial<IBill>[] = this.dataSource.data.map(
      (bill: IBill) => ({
        idbill: bill.idbill || 0,
        idcustomer: bill.idcustomer || 0,
        dateorder: bill.dateorder,
        namecustomer: bill.namecustomer,
        phone: bill.phone,
        address: bill.address,
        totalamount: bill.totalamount || 0, // Đảm bảo totalamount là số
        status: bill.status || 0, // Đảm bảo status là số
        pay: bill.pay,
        transactioncode: bill.transactioncode,
        message: bill.message,
        coupon: bill.coupon || 0, // Đảm bảo coupon là số
        idcoupon: bill.idcoupon || 0, // Đảm bảo idcoupon là số
      })
    );
    TableUtil.exportArrayToExcel(customerData, 'Bill');
  }
  detail(idbill: number) {
    // Mở trang "detail/:id" trong tab mới
    window.open(`/chitietdathang/${idbill}`, '_blank');
  }
  message = '';
  onStatusChange(id: number, status: number): void {
    this.billService.updateBillStatus(id, status).subscribe((data) => {
      this.message = data.message;
      setTimeout(() => {
        this.message = ''; // Xóa thông báo sau 2 giây
        this.loadBills(); // Tải lại dữ liệu sau khi cập nhật trạng thái
      }, 2000); 
    });
  }
}
