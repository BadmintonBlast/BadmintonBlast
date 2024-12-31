import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICart } from '../../interfaces/i-Cart';
@Injectable({
  providedIn: 'root'
})
export class DataShareService {
  private databuySource = new BehaviorSubject<boolean[]>([]);
  private totalbuySource = new BehaviorSubject<number>(0);
  private couponSource = new BehaviorSubject<number>(0);
  private totalPriceProduct = new BehaviorSubject<number>(0);

  // Observables for other components to subscribe to
  databuy$ = this.databuySource.asObservable();
  totalbuy$ = this.totalbuySource.asObservable();
  coupon$ = this.couponSource.asObservable();
  totalPrice$ = this.totalPriceProduct.asObservable();

  // Methods to set data
  setDatabuy(databuy: boolean[]) {
    this.databuySource.next(databuy);
  }

  setTotalbuy(totalbuy: number) {
    this.totalbuySource.next(totalbuy);
  }

  setCoupon(coupon: number | null) {
    this.couponSource.next(coupon);
  }
  setTotalPrice(totalPrice: number) {
    this.totalPriceProduct.next(totalPrice);
  }
}
