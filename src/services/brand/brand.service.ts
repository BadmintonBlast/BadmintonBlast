import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IBrand } from '../../interfaces/i-Brand';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http:HttpClient) { }

  getBrandPage( pageIndex:number,pageSize:number)
  {
    return this.http.get<IBrand[]>(`${environment.apiUrl}Brands?pageIndex=${pageIndex}&pageSize=${pageSize}`);
  }
  getAllBrands(): Observable<IBrand[]> {
    return this.http.get<IBrand[]>(`${environment.apiUrl}Brands`);
  }
  getBrandById(id: number): Observable<IBrand> {
    return this.http.get<IBrand>(`${environment.apiUrl}Brands/${id}`);
  }
  createBrand(brand: IBrand): Observable<IBrand> {
    const formData = new FormData();
  
    formData.append('idbrand', brand.idbrand.toString());
    formData.append('namebrand', brand.namebrand);
    formData.append('description', brand.description);
  
    if (brand.image) {
      formData.append('image', brand.image, brand.image.name); // Thêm file vào FormData
    }
  
    return this.http.post<IBrand>(`${environment.apiUrl}Brands/Insert`, formData);
  }
  
  updateBrand(brand: IBrand): Observable<IBrand> {
    return this.http.put<IBrand>(`${environment.apiUrl}Brands`, brand);
  }
  deleteBrand(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}Brands/${id}`);
  }
}
