import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from '../../../services/customer/customers.service';
import { ICustomer } from '../../../interfaces/i-Customers';
import { TableUtil } from './tableUtil';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { PagingComponent } from '../../components/paging/paging.component';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { DetailCustomerComponent } from '../../admin/detail-customer/detail-customer.component';
import { ManagerHeaderComponent } from '../manager-header/manager-header.component';

@Component({
  selector: 'app-manager-customer',
  standalone: true,
  imports: [
    CommonModule,
    PagingComponent,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    MatMenuModule,
    MatMenu,
    DetailCustomerComponent,
    ManagerHeaderComponent,
  ],
  templateUrl: './manager-customer.component.html',
  styleUrls: ['./manager-customer.component.css'],
})
export class ManagerCustomerComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  customerForm: FormGroup;
  dataSource: MatTableDataSource<ICustomer> =
    new MatTableDataSource<ICustomer>();
  totalCustomers: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;
  keyword: string = '';
  statusUser: boolean = false;
  selectedCustomerId!: number;
  Math = Math; // Để có thể sử dụng Math trong template
  displayedColumns: string[] = [
    'Mã khách hàng',
    'Tên khách hàng',
    'Số điện thoại',
    'email',
    'Trạng thái',
    'Vai trò',
    'Hành động',
  ];
  customer: ICustomer = {
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
      status: false,
      role: '',
      birthday: new Date(),
    };
  constructor(
    private customersService: CustomersService,
    private formBuilder: FormBuilder
  ) {
    this.customerForm = this.formBuilder.group({
      idCustomer: [0],
      nameCustomer: ['', Validators.required],
      imageCustomer: [null],
      phone: ['', Validators.required],
      province: [''],
      district: [''],
      village: [''],
      hamlet: [''],
      email: ['', [Validators.required, Validators.email]],
      passwordHash: [''],
      status: [true],
      role: [''],
    });
  }
  handleAddUserStatus(status: boolean): void {
    this.statusUser = status; // Cập nhật trạng thái
  }

  search(key: string) {
    this.keyword = key;
    this.loadCustomers(); // Tải lại dữ liệu với từ khóa mới
  }
  openAddProduct() {
    this.statusUser = true; // Set to true to show the add product component
  }

  ngOnInit(): void {
    this.loadCustomers();
  }
  onPageChanged(newPageIndex: number): void {
    this.pageIndex = newPageIndex; // Cập nhật trang hiện tại
    this.loadCustomers(); // Tải lại dữ liệu theo trang mới
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.customerForm.patchValue({
        imageCustomer: file,
      });
    }
  }

  // addCustomers(): void {
  //   if (this.customerForm.valid) {
  //     const customer: ICustomer = {
  //       idcustomer: this.customerForm.get('idCustomer')?.value,
  //       namecustomer: this.customerForm.get('nameCustomer')?.value,
  //       imageCustomer: this.customerForm.get('imageCustomer')?.value,
  //       phone: this.customerForm.get('phone')?.value,
  //       province: this.customerForm.get('province')?.value,
  //       district: this.customerForm.get('district')?.value,
  //       village: this.customerForm.get('village')?.value,
  //       hamlet: this.customerForm.get('hamlet')?.value,
  //       email: this.customerForm.get('email')?.value,
  //       passwordHash: this.customerForm.get('passwordHash')?.value,
  //       status: this.customerForm.get('status')?.value,
  //       role: this.customerForm.get('role')?.value,
  //       birthday: this.customerForm.get('birthday')?.value,
  //     };

  //     this.customersService.insertCustomer(customer).subscribe({
  //       next: () => {
  //         console.log('Tạo khách hàng thành công');
  //         this.customerForm.reset();
  //         this.loadCustomers(); // Reload customers after addition
  //       },
  //       error: (err) => {
  //         console.error('Lỗi tạo khách hàng:', err);
  //       },
  //     });
  //   } else {
  //     console.log('Form is invalid');
  //   }
  // }

  loadCustomers(): void {
    this.customersService
      .getCustomers(this.pageIndex, this.pageSize, this.keyword)
      .subscribe((data) => {
        this.dataSource.data = data;
      });

    this.customersService.getTotalCustomers(this.keyword).subscribe((total) => {
      this.totalCustomers = total;
    });
  }

  deleteCustomer(id: string) {
    this.customersService.deleteCustomer(id).subscribe({
      next: () => {
        console.log('Xóa khách hàng thành công');
        this.loadCustomers(); // Reload customers after deletion
      },
      error: (err) => {
        console.error('Lỗi xóa khách hàng:', err);
      },
    });
  }
  editCustomer(customerId: number,status:boolean) {
    this.customersService.getCustomerId(customerId).subscribe(data=>{
      this.customer = data;
      this.customer.status=status;
      this.updateCustomer();
    })
  }
  editRoleCustomer(customerId: number,role:string)   {
    this.customersService.getCustomerId(customerId).subscribe(data=>{
      this.customer = data;
      this.customer.role=role;
      this.updateCustomer();
    })
  }
  exportCustomerArrayToExcel() {
    // Lọc dữ liệu và loại bỏ trường passwordHash
    const customerData: Partial<ICustomer>[] = this.dataSource.data.map(
      ({ imageCustomer, passwordHash, ...rest }) => ({
        ...rest,
      })
    );
    TableUtil.exportArrayToExcel(customerData, 'Customer');
  }

  maskPhoneNumber(phoneNumber: string): string {
    if(phoneNumber===null)
    {  return'';}
    if (phoneNumber.length < 7) return ''; // Kiểm tra nếu số quá ngắn

    // Lấy 3 số đầu và 3 số cuối
    const start = phoneNumber.slice(0, 3);
    const end = phoneNumber.slice(-3);

    // Trả về định dạng số điện thoại với các số giữa được thay bằng dấu *
    return `${start}*****${end}`;
  }

  updateCustomer() {
    const formData = new FormData();
    // Thêm các giá trị vào formData từ customer
    formData.append('idcustomer', String(this.customer.idcustomer));
    // Các trường khác của customer
    formData.append('namecustomer', this.customer.namecustomer || '');
    formData.append('phone', this.customer.phone || '');
    formData.append('province', this.customer.province || '');
    formData.append('district', this.customer.district || '');
    formData.append('village', this.customer.village || '');
    formData.append('hamlet', this.customer.hamlet || '');
    formData.append('email', this.customer.email || '');
    formData.append('passwordHash', this.customer.passwordHash || '');
    formData.append('status', String(this.customer.status));  // Đảm bảo status là chuỗi
    formData.append('role', this.customer.role || '');
   if (this.customer.birthday) {
    // Nếu birthday là chuỗi, chuyển nó thành đối tượng Date
    const birthdayDate = typeof this.customer.birthday === 'string' 
      ? new Date(this.customer.birthday) 
      : this.customer.birthday;
  
    // Kiểm tra xem đối tượng có phải là Date hợp lệ không
    if (birthdayDate instanceof Date && !isNaN(birthdayDate.getTime())) {
      formData.append('birthday', birthdayDate.toISOString().split('T')[0]);
    }
  
    // Gửi request tới API
    this.customersService.updateCustomer(this.customer.idcustomer, formData).subscribe(data => {
      console.log('hi')
      this.loadCustomers();
    }, error => {
      console.error('Error updating customer:', error);
    });
  }
}
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
