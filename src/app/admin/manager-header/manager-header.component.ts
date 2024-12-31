import { Component, Output, EventEmitter } from '@angular/core';
import { CustomersService } from '../../../services/customer/customers.service';
import { ICustomer } from '../../../interfaces/i-Customers';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common'
@Component({
  selector: 'app-manager-header',
  standalone: true,
  imports: [FormsModule, CommonModule, NgOptimizedImage],
  templateUrl: './manager-header.component.html',
  styleUrl: './manager-header.component.css',
})
export class ManagerHeaderComponent {
  @Output() searchTerm = new EventEmitter<string>();
  idcustomer: number = 0;
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
  constructor(private customer: CustomersService) {
    this.idcustomer = this.customer.getClaimValue();
    if (this.idcustomer!==0) {
      this.customer.getCustomerId(this.idcustomer).subscribe((customer) => {
        this.adcustomer = customer;
      });
    }
  }
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value; // Đặt biến inputValue để lưu giá trị nhập vào
    this.searchTerm.emit(inputValue); // Phát sự kiện với giá trị nhập vào
  }
}
