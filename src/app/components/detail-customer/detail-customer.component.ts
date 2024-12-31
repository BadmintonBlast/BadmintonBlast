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
      idcustomer: '',
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
      role: ''
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
      this.customerservice.getCustomerId(this.customerId).subscribe({
        next: (res) => {
          this.customer=res;
          console.log(this.customer);
          // Reload customers after deletion
        },
        error: (err) => {
          console.error('Lỗi xóa khách hàng:', err);
        },
      });
    }
   
}
