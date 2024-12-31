import { Component,Input,Output,EventEmitter } from '@angular/core';
import { ICoupons } from '../../../interfaces/i-Coupon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CouponService } from '../../../services/coupon/coupon.service';
@Component({
  selector: 'app-add-voucher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-voucher.component.html',
  styleUrl: './add-voucher.component.css',
})
export class AddVoucherComponent {
  showModal: boolean = false;
  @Input() idcoupon=0;
  @Output() closeFormEvent = new EventEmitter<void>();
  coupon: ICoupons = {
    idcoupon: 0,
    promotion: 0,
    startdate: '',
    enddate: '',
    quality: 0,
    description: '',
  };
  constructor(private couponService: CouponService) {}
  ngOnInit() {
    if(this.idcoupon>0)
    {
      this.couponService.getIdCoupons(this.idcoupon).subscribe((coupon) => {
        this.coupon = coupon;
        if (this.coupon.startdate) {
          this.coupon.startdate = this.coupon.startdate.split('T')[0]; // Chỉ giữ lại phần ngày
        }
        if (this.coupon.enddate) {
          this.coupon.enddate = this.coupon.startdate.split('T')[0]; // Chỉ giữ lại phần ngày
        }
      });
    }
  }

  closeModal() {  
      this.closeFormEvent.emit();
  }

  insertCoupon() {
    this.couponService.insertCoupons(this.coupon).subscribe((response) => {
      console.log(response);
    });
    if(this.idcoupon) { 
      this.couponService.updateCoupon(this.idcoupon,this.coupon).subscribe((response) => {
        console.log(response);
      });
    }
    this.closeModal();
  }
}
  