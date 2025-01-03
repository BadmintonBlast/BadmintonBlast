import { Component,OnDestroy,ChangeDetectorRef } from '@angular/core';
import { Subject,forkJoin} from 'rxjs';
import { takeUntil,switchMap,map} from 'rxjs/operators';
import { HeaherComponent } from '../../components/heaher/heaher.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CustomersService } from '../../../services/customer/customers.service';
import { ICustomer } from '../../../interfaces/i-Customers';
import { CommonModule } from '@angular/common';
import { IOrder } from '../../../interfaces/i-Order';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../../notification/notification.component';
import { BillService } from '../../../services/bill/bill.service';
import { IBillDetail } from '../../../interfaces/i-Bill';
import { ProductService } from '../../../services/product/product.service';
import { IProduct } from '../../../interfaces/i-Product';
import { PreviewComponent } from "../preview/preview.component";
import { PreviewService } from '../../../services/preview/preview.service';
import { Router } from '@angular/router';
import { of,catchError } from 'rxjs';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    HeaherComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    NotificationComponent,
    PreviewComponent
],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  phoneNumber: string = '0912345678'; // Số điện thoại mẫu
  adcustomer: ICustomer = {
    idcustomer: 0,
    namecustomer: '',
    imageCustomer: '',
    phone: '',
    province: '',
    district: '',
    village: '',
    hamlet: '',
    email: '',
    passwordHash: '',
    status: true,
    role: 'customer',
    birthday: new Date(),
  };

  profileImageUrl: string | ArrayBuffer | null = null; // Để lưu URL hình ảnh
  selectedFile: File | null = null; // Để lưu tệp hình ảnh đã chọn
  menu: string = 'thongtin';
  hidenotify: boolean = false;
  message: string = '';
  bills: IBillDetail[] = []; // Mảng lưu thông tin các hóa đơn
  ordersByBillId: { [key: number]: IOrder[] } = {}; // Lưu đơn hàng theo idbill
  productOrderIds: { [key: number]: IProduct[] } = {};
  role = localStorage.getItem('role');
  constructor(
    private customer: CustomersService,
    private billService: BillService,
    private productService: ProductService,
    private previewService: PreviewService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.adcustomer.idcustomer = this.customer.getClaimValue();
    if (this.adcustomer.idcustomer) {
      this.getCustomerId();
    }
  }
  getCustomerId() {
    this.customer
      .getCustomerId(this.adcustomer.idcustomer)
      .subscribe((customer) => {
        this.adcustomer = customer;
        this.profileImageUrl = this.adcustomer.imageCustomer;
      });
  }
  // Hàm xử lý sự kiện khi người dùng chọn ảnh
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImageUrl = reader.result; // Cập nhật URL để hiển thị hình ảnh
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  selectedStatus: number = undefined;
  statuses = [
    { name: undefined, displayName: 'Tất cả' },
    { name: 900, displayName: 'Chờ Xác Nhận' },
    { name: 901, displayName: 'Chờ Lấy Hàng' },
    { name: 902, displayName: 'Giao Thành Công' },
    { name: 903, displayName: 'Đã Lấy Hàng' },
    { name: 904, displayName: 'Đã Hủy' },
    { name: 905, displayName: 'Trả Hàng/Hoàn Tiền' },
  ];
  changeStatus(status: number): void {
    this.selectedStatus = status; // Cập nhật trạng thái đã chọn
    this.loadBills(status); // Gọi lại loadBills với trạng thái mới
  }
  onStatusChange(id: number): void {
    this.billService.updateBillStatus(id, 904).subscribe((data) => {
      this.message = data.message;
      setTimeout(() => {
        this.message = ''; // Xóa thông báo sau 2 giây
        this.loadBills(undefined);
      }, 2000);
    });
  }
  idbill:number=0
  preview(idbill:number) {
    this.idbill=idbill
  }
  closePreview()
  {
    this.idbill=0
  }
  // Phương thức lấy danh sách đơn hàng
  billStatuses: { [idbill: number]: boolean } = {};
    loadBills(status: number): void {
      this.bills = []; // Reset danh sách bills
      this.billStatuses = {}; // Reset trạng thái của các bill
    
      this.billService.getBillsByCustomer(this.adcustomer.idcustomer, status).pipe(
        takeUntil(this.destroy$), // Hủy các yêu cầu khi component bị hủy
        switchMap((bills) => {
          this.bills = [...bills].reverse(); // Lật lại danh sách hóa đơn
    
          // Tạo một mảng các yêu cầu preview cho mỗi bill
          const previewRequests = this.bills.map(bill =>
            this.previewService.getidBillPreview(bill.idbill).pipe(
              map((data) => {
                if (data && data.length !== 0) {
                  this.billStatuses[bill.idbill] = true;  // Có dữ liệu
                } else {
                  this.billStatuses[bill.idbill] = false;  // Không có dữ liệu
                }
              }),
              catchError(() => {
                // Nếu có lỗi khi lấy dữ liệu preview, bỏ qua mà không thông báo lỗi
                this.billStatuses[bill.idbill] = false;
                return of(null); // Trả về một observable hoàn thành để tiếp tục
              })
            )
          );
    
          // Sử dụng forkJoin để chờ tất cả các yêu cầu preview hoàn thành
          return previewRequests.length ? forkJoin(previewRequests) : [];
        })
      ).subscribe({
        next: () => {
          // Xử lý khi tất cả các yêu cầu đã hoàn thành
        }
      });
    }
    
  // Hàm để ẩn các số giữa của số điện thoại
  maskPhoneNumber(phoneNumber: string): string {
    if (phoneNumber.length < 7) return phoneNumber; // Kiểm tra nếu số quá ngắn
    // Lấy 3 số đầu và 3 số cuối
    const start = phoneNumber.slice(0, 3);
    const end = phoneNumber.slice(-3);
    // Trả về định dạng số điện thoại với các số giữa được thay bằng dấu *
    return `${start}*****${end}`;
  }
  Comfirm(id:number)
  {
      this.billService.updateBillStatus(id, 903).subscribe((data) => {
        this.message = data.message;
        setTimeout(() => {
          this.message = ''; // Xóa thông báo sau 2 giây
          this.loadBills(902);
        }, 2000);
      });
  }
  hidemenu(menu: string) {
    this.menu = menu;
    if (this.menu === 'donmua') {
      this.loadBills(undefined);
    }
    
    if (this.menu === 'trangquanly') {
      this.router.navigate(['/menu/thongke']);
    } 
  }
  logout() {
    this.customer.removeToken();
    window.location.href = '/';
  }
  statusPreview=true 
  uploadProfile(): void {
    const formData = new FormData();
    const birthday = document.getElementById('birthday') as HTMLInputElement;
    if (birthday) {
      const selectedDate = birthday.value;
      this.adcustomer.birthday = new Date(selectedDate);
    }

    // Chuyển đổi idcustomer thành chuỗi trước khi thêm vào FormData
    formData.append('idcustomer', String(this.adcustomer.idcustomer));

    if (this.selectedFile) {
      formData.append(
        'imageCustomer',
        this.selectedFile,
        this.selectedFile.name
      );
    }
    formData.append('namecustomer', this.adcustomer.namecustomer || ''); // Bổ sung giá trị mặc định
    formData.append('phone', this.adcustomer.phone || '');
    formData.append('province', this.adcustomer.province || '');
    formData.append('district', this.adcustomer.district || '');
    formData.append('village', this.adcustomer.village || '');
    formData.append('hamlet', this.adcustomer.hamlet || '');
    formData.append('email', this.adcustomer.email || '');
    formData.append('passwordHash', this.adcustomer.passwordHash || '');
    formData.append('status', String(this.adcustomer.status)); // Đảm bảo status là chuỗi
    formData.append('role', this.adcustomer.role || '');
    formData.append(
      'birthday',
      this.adcustomer.birthday.toISOString().split('T')[0]
    );
    this.customer
      .updateCustomer(this.adcustomer.idcustomer, formData)
      .subscribe({
        next: (response) => {
          this.message = 'Lưu thay đổi thành công!';
          this.hidenotify = true;
          setTimeout(() => {
            this.hidenotify = false; // ��n thông báo sau 2 giây
          }, 2000);
        },
        error: (err) => {
          this.message = 'lỗi lưu thay đổi!';
          this.hidenotify = true;
          setTimeout(() => {
            this.hidenotify = false; // ��n thông báo sau 2 giây
          }, 2000);
        },
      });
  }
  ngOnDestroy(): void {
    // Hủy tất cả yêu cầu khi component bị hủy
    this.destroy$.next();
    this.destroy$.complete();
  }
}
