import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IProductStock } from '../../interfaces/i-ProductStock';
@Injectable({
  providedIn: 'root'
})
export class ProductstockService {

  constructor(private http:HttpClient) { }

 getProductStock():Observable<IProductStock> {
   return this.http.get<IProductStock>(`${environment.apiUrl}ProductStock`);
 }
getIdProductStock(id :number): Observable<IProductStock> {
  return this.http.get<IProductStock>(`${environment.apiUrl}ProductStock/${id}`);
}        

 insertProductStock(productStock: IProductStock): Observable<IProductStock> {
   return this.http.post<IProductStock>(`${environment.apiUrl}ProductStock`, productStock);
 }
 updateProductStock(productStock: IProductStock): Observable<IProductStock> {
   return this.http.put<IProductStock>(`${environment.apiUrl}ProductStock/${productStock.id}`, productStock);
 }
 deleteProductStock(productStock: IProductStock): Observable<void> {
   return this.http.delete<void>(`${environment.apiUrl}ProductStock/${productStock.id}`);
 }
 getIdProduct(idproduct: number|0): Observable<IProductStock[]> {
   return this.http.get<IProductStock[]>(`${environment.apiUrl}ProductStock/Product/${idproduct}`);
 }        

 deleteProductId(Id: number): Observable<IProductStock> {
  return this.http.delete<IProductStock>(`${environment.apiUrl}ProductStocks/${Id}`);
}
}
