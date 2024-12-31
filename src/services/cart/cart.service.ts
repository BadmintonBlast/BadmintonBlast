import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient  } from '@angular/common/http';
import { ICart } from '../../interfaces/i-Cart';
@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }

// Lấy thông tin Cart theo ID
getCartById(idcustomer: number): Observable<ICart[]> {
  return this.http.get<ICart[]>(`${environment.apiUrl}Carts/${idcustomer}`);
}
// Thêm một Cart mới
addCart(cart: any): Observable<any> {
  return this.http.post<ICart>(`${environment.apiUrl}Carts/Insert`, cart);
}
// Cập nhật thông tin Cart
updateCart(id: number, cart: ICart): Observable<void> {
  return this.http.put<void>(`${environment.apiUrl}Carts/${id}`, cart);
}
// Xóa Cart theo ID
deleteCart(id: number): Observable<void> {
  return this.http.delete<void>(`${environment.apiUrl}Carts/${id}`);
}

}
