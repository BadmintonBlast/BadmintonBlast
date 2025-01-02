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
    const formData = new FormData();
    formData.append('Idkindproduct',product.idkindproduct.toString());
    formData.append('Nameproduct', product.nameproduct);
    formData.append('Image', product.image);
    return this.http.put<Ikindproduct>(`${environment.apiUrl}KindProducts/${product.idkindproduct}`, formData );
  }

  getIdKindProduct(id:number): Observable<Ikindproduct> {
    return this.http.get<Ikindproduct>(`${environment.apiUrl}KindProducts/${id}`);
  }
  deleteKindProduct(id:number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}KindProducts/${id}`);
  }
}
