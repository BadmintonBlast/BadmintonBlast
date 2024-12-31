import { Component } from '@angular/core';
import { OrderService } from '../../../services/order/order.service';
import { BillService } from '../../../services/bill/bill.service';
import { IBillDetail } from '../../../interfaces/i-Bill';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { exportToWord } from '../../../interfaces/exportToWord';
@Component({
  selector: 'app-detail-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-order.component.html',
  styleUrl: './detail-order.component.css',
})
export class DetailOrderComponent {
  bill: IBillDetail;
  idbill: number = 0;
  constructor(private billService: BillService, private route: ActivatedRoute) {
    this.idbill = Number(this.route.snapshot.paramMap.get('id'));
    this.getOrder(this.idbill);
  }
  getOrder(id: number) {
    this.billService.getBillId(id).subscribe((order) => {
      this.bill = order;
    });
  }
  Inbill() {
    exportToWord(this.bill);
  }
}
