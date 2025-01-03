import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ICoupons } from '../../interfaces/i-Coupon';
@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(private http:HttpClient) {
    
   }

  getCoupons():Observable<ICoupons[]> { 
    return this.http.get<ICoupons[]>(`${environment.apiUrl}Coupons`);}

  insertCoupons(coupons: ICoupons): Observable<ICoupons>
  {
    return this.http.post<ICoupons>(`${environment.apiUrl}Coupons/Insert`, coupons);
  }
  updateCoupon(coupon: ICoupons): Observable<any> {
    return this.http.put(`${environment.apiUrl}Coupons/${coupon.idcoupon}`, coupon);
  }
  getIdCoupons(id: number): Observable<ICoupons>
  {
    return this.http.get<ICoupons>(`${environment.apiUrl}Coupons/${id}`);
  }
  deleteCoupons(id: string)
  {
     this.http.delete<ICoupons>(`${environment.apiUrl}Coupons/${id}`).subscribe({
      next: () => console.log('Xóa phiếu giảm giá thành công'),
      error: error => console.error('Lỗi xóa phiếu giảm giá', error)
    });
  }

}
