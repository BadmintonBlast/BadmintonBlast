import { Component, OnInit } from '@angular/core';
import { IBill } from '../../../interfaces/i-Bill';
import { BillService } from '../../../services/bill/bill.service';
import { PagingComponent } from '../paging/paging.component';
import { TableUtil } from '../managerCustomer/tableUtil';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    PagingComponent,
    MatMenuModule,
    NgFor,
    CommonModule,
    PagingComponent,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    MatMenuModule,
    MatMenu,
  ],
  templateUrl: './order.component.html',
  styleUrl: '../managerCustomer/manager-customer.component.css',
})
export class OrderComponent {
  bills: IBill[] = [];
  keyword: string = '';
  pageSize: number = 2;
  pageIndex: number = 1;
  totalBills: number = 0;
  dateStart: string | null = '';
  dateEnd: string | null = '';
  status: number | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  Math = Math; // Để có thể sử dụng Math trong template
  showStatusSelection: boolean = false; // Biến điều khiển hiển thị khung
  selectedStatus: number | null = null; // Biến lưu trạng thái đã chọn
  dataSource: MatTableDataSource<IBill> = new MatTableDataSource<IBill>();
  displayedColumns: string[] = [
    'idbill',
    'namecustomer',
    'phone',
    'totalamount',
    'dateorder',
    'status',
    'actions',
  ];
  orderStatuses = [
    { code: null, description: 'Select All' },
    { code: 900, description: 'Đơn Mới' },
    { code: 901, description: 'Chờ Lấy Hàng' },
    { code: 902, description: 'Lấy Hàng' },
    { code: 903, description: 'Đã Lấy Hàng' },
    { code: 904, description: 'Giao Hàng' },
    { code: 905, description: 'Giao Thành Công' },
    { code: 906, description: 'Giao Thất Bại' },
    { code: 907, description: 'Đang Chuyển Hoàn' },
    { code: 908, description: 'Chuyển Hoàn' },
    { code: 909, description: 'Đã Đối Soát' },
    { code: 910, description: 'Đã Đối Soát Khách' },
    { code: 911, description: 'Đã Trả COD Cho Khách' },
    { code: 912, description: 'Chờ Thanh Toán COD' },
    { code: 913, description: 'Hoàn Thành' },
    { code: 914, description: 'Đơn Hủy' },
    { code: 915, description: 'Chậm Lấy/Giao' },
    { code: 916, description: 'Giao Hàng Một Phần' },
    { code: 1000, description: 'Đơn Lỗi' },
  ];
  getStatusColor(statusCode: number |null): string {
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
      case 906:
        return '#FF4500'; // Orange Red
      case 907:
        return '#FF6347'; // Tomato
      case 908:
        return '#DC143C'; // Crimson
      case 909:
        return '#8A2BE2'; // Blue Violet
      case 910:
        return '#9932CC'; // Dark Orchid
      case 911:
        return '#DAA520'; // Goldenrod
      case 912:
        return '#B8860B'; // Dark Goldenrod
      case 913:
        return '#7CFC00'; // Lawn Green
      case 914:
        return '#FF0000'; // Red
      case 915:
        return '#FFA500'; // Orange
      case 916:
        return '#00FF7F'; // Spring Green
      case 1000:
        return '#FF0000'; // Red (for error)
      default:
        return '#FFFFFF'; // Default to white
    }
  }
  
  filterByStatus(status: number|null) {
    this.selectedStatus = status;
   
  }
  trackByCode(index: number, status: any): number {
    return status.code;
  }
  
  confirmStatusChange() {
    this.showStatusSelection = !this.showStatusSelection;// Cập nhật biến chính thức
    this.status=this.selectedStatus
    this.loadBills();
  }
  constructor(private billService: BillService) {}

  ngOnInit(): void {
    this.loadBills();
  }
  toggleSort() {
    this.showStatusSelection = !this.showStatusSelection;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.orderStatuses = this.sortDirection === 'asc'
      ? this.orderStatuses.sort((a, b) => a.description.localeCompare(b.description))
      : this.orderStatuses.sort((a, b) => b.description.localeCompare(a.description));
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
        idbill: bill.idbill || 0, // Chuyển đổi sang số, sử dụng 0 nếu không có giá trị
        idcustomer: bill.idcustomer || 0, // Tương tự cho idcustomer
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

    console.log(customerData); // In ra dữ liệu để kiểm tra
    TableUtil.exportArrayToExcel(customerData, 'Bill');
  }
}
