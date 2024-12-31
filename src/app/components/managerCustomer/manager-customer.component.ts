import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from '../../../services/customer/customers.service';
import { ICustomer } from '../../../interfaces/i-Customers';
import { TableUtil } from './tableUtil';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { PagingComponent } from '../paging/paging.component';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { DetailCustomerComponent } from '../detail-customer/detail-customer.component';

@Component({
  selector: 'app-manager-customer',
  standalone: true,
  imports: [
    NgFor,
    CommonModule,
    PagingComponent,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    MatMenuModule,
    MatMenu,
    DetailCustomerComponent,
  ],
  templateUrl: './manager-customer.component.html',
  styleUrls: ['./manager-customer.component.css'],
})
export class ManagerCustomerComponent {
  customerForm: FormGroup;
  dataSource: MatTableDataSource<ICustomer> =
    new MatTableDataSource<ICustomer>();
  totalCustomers: number = 0;
  pageIndex: number = 1;
  pageSize: number = 2;
  keyword: string = '';
  statusUser: boolean = false;
  selectedCustomerId!: number;
  Math = Math; // Để có thể sử dụng Math trong template
  displayedColumns: string[] = [
    'idcustomer',
    'imageCustomer',
    'namecustomer',
    'phone',
    'email',
    'role',
    'status',
    'actions',
  ];
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

  addCustomers(): void {
    if (this.customerForm.valid) {
      const customer: ICustomer = {
        idcustomer: this.customerForm.get('idCustomer')?.value,
        namecustomer: this.customerForm.get('nameCustomer')?.value,
        imageCustomer: this.customerForm.get('imageCustomer')?.value,
        phone: this.customerForm.get('phone')?.value,
        province: this.customerForm.get('province')?.value,
        district: this.customerForm.get('district')?.value,
        village: this.customerForm.get('village')?.value,
        hamlet: this.customerForm.get('hamlet')?.value,
        email: this.customerForm.get('email')?.value,
        passwordHash: this.customerForm.get('passwordHash')?.value,
        status: this.customerForm.get('status')?.value,
        role: this.customerForm.get('role')?.value,
      };

      this.customersService.insertCustomer(customer).subscribe({
        next: () => {
          console.log('Tạo khách hàng thành công');
          this.customerForm.reset();
          this.loadCustomers(); // Reload customers after addition
        },
        error: (err) => {
          console.error('Lỗi tạo khách hàng:', err);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

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
  editCustomer(customerId: number) {  
    this.selectedCustomerId = customerId;  
    this.statusUser = true;
  }

  exportCustomerArrayToExcel() {
    // Lọc dữ liệu và loại bỏ trường passwordHash
    const customerData: Partial<ICustomer>[] = this.dataSource.data.map(
      ({ imageCustomer, passwordHash, ...rest }) => ({
        ...rest,
      })
    );

    console.log(customerData); // In ra dữ liệu để kiểm tra
    TableUtil.exportArrayToExcel(customerData, 'Customer');
  }
}
