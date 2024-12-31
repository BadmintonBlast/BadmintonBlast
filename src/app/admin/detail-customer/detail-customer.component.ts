import { Component, EventEmitter, Output, Input} from '@angular/core';
import { ICustomer } from '../../../interfaces/i-Customers';
import { CustomersService } from '../../../services/customer/customers.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-customer',
  standalone: true,
  imports: [CommonModule,FormsModule ],
  templateUrl: './detail-customer.component.html',
  styleUrl: './detail-customer.component.css'
})
export class DetailCustomerComponent {
  @Input() customerId!: number;
  
  @Output() statusUser: EventEmitter<boolean> =
    new EventEmitter<boolean>();
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

    constructor(private customerservice: CustomersService)
    {

    }
    ngOnInit() {
      if (this.customerId) {
        this.getCustomer();
      }
    }
    closeAddUser() {
      this.statusUser.emit(false);
    }
    getCustomer() {
      this.customerservice.getCustomerId(this.customerId).subscribe(data=>{
        this.customer = data;
        
      })
    }
    updateCustomer() {
      console.log(this.customer);
    
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
     console.log( this.customer.role );
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
      this.customerservice.updateCustomer(this.customer.idcustomer, formData).subscribe(data => {
        console.log('Customer updated:', data);
        this.closeAddUser();  // Đóng form sau khi update thành công
      }, error => {
        console.error('Error updating customer:', error);
      });
    }
  }
}
