import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Ikindproduct } from '../../interfaces/i-KindProduct';
import { HttpClient  } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class KindproductService {

  constructor(private http:HttpClient ) {}
  getKindproductPage(pageIndex:number,pageSize:number): Observable<Ikindproduct[]> {
    return this.http.get<Ikindproduct[]>(`${environment.apiUrl}KindProducts?pageIndex=${pageIndex}&pageSize=${pageSize}`);
  }
  getKindproducts(): Observable<Ikindproduct[]> {
    return this.http.get<Ikindproduct[]>(`${environment.apiUrl}KindProducts`);
  }
  insertKindProduct(product: Ikindproduct): Observable<Ikindproduct> {
    const formData = new FormData();
    formData.append('idkindproduct',product.idkindproduct.toString());
    formData.append('nameproduct', product.nameproduct);
    formData.append('image', product.image);
    return this.http.post<Ikindproduct>(`${environment.apiUrl}KindProducts/Insert`, formData);
  }
  updateKindProduct(product: Ikindproduct): Observable<Ikindproduct> {
    return this.http.put<Ikindproduct>(`${environment.apiUrl}KindProducts/${product.idkindproduct}`, product);
  }

  getIdKindProduct(product: Ikindproduct): Observable<Ikindproduct> {
    return this.http.get<Ikindproduct>(`${environment.apiUrl}KindProducts/${product.idkindproduct}`);
  }
  deleteKindProduct(product: Ikindproduct): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}KindProducts/${product.idkindproduct}`);
  }
}
