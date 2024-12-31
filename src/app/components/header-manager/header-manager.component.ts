import { Component, Input } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ManagerCustomerComponent } from '../managerCustomer/manager-customer.component';
import { ManagerProductComponent } from '../manager-product/manager-product.component';
import { NgIf } from '@angular/common';
import { OrderComponent } from '../order/order.component';

@Component({
  selector: 'app-header-manager',
  standalone: true,
  imports: [
    MatDatepickerModule,
    ManagerCustomerComponent,
    ManagerProductComponent,
    NgIf,
    OrderComponent,
  ],
  templateUrl: './header-manager.component.html',
  styleUrl: './header-manager.component.css',
})
export class HeaderManagerComponent {
  @Input() selectedIndex: number = 1;
}
