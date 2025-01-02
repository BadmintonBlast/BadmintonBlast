  import { Injectable } from '@angular/core';
  import { environment } from '../../environments/environment';
  import { HttpClient , HttpParams } from '@angular/common/http';
  import { IProduct } from '../../interfaces/i-Product';
  import { Observable } from 'rxjs';
  @Injectable({
    providedIn: 'root'
  })
  export class ProductService {

    constructor(private http: HttpClient) { }
    getProductsAsync(keyword: string | null, Idkindproduct: number | null, pageIndex: number, pageSize: number, discount:number|0,idbrand:number|0,minprice:number,maxPrice:number): Observable<IProduct[]> {
      let params = new HttpParams()
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString());
    
      if (keyword && keyword.trim() !== '') {
        params = params.set('keyword', keyword);
      }
    
      if (Idkindproduct !== null && Idkindproduct !== undefined) {
        params = params.set('Idkindproduct', Idkindproduct.toString());
      }
      if (discount !== 0) {
        params = params.set('discount', discount .toString());
      }
      if(idbrand!==0)
      {
        params = params.set('brandId', idbrand.toString());
      }
      if(minprice!==0)
      {
        params = params.set('minprice', minprice.toString());
      }
      if(maxPrice!==0)
      {
        params = params.set('maxprice', maxPrice.toString());
      }
      // console.log(`${environment.apiUrl}Products/getProduct?${params.toString()}`);

      return this.http.get<IProduct[]>(`${environment.apiUrl}Products/getProduct`, { params });
    }
    
    getTotalProduct(keyword: string, IdKindProduct: number,discount:number,idbrand:number|0,minprice:number,maxPrice:number): Observable<number> {
      let params = new HttpParams();
      
      if (keyword && keyword.trim() !== '') {
        params = params.set('keyword', keyword);
      }
      

      if (IdKindProduct !== 0) {
        params = params.set('IdKindProduct', IdKindProduct.toString());
      }

      if (discount!== null) {
        params = params.set('discount', discount.toString());
      }
      if(idbrand!==0)
        {
          params = params.set('brandId', idbrand.toString());
        }
        if(minprice!==0)
        {
          params = params.set('minprice', minprice.toString());
        }
        if(maxPrice!==0)
        {
          params = params.set('maxprice', maxPrice.toString());
        }
      const fullUrl = `${environment.apiUrl}Products/GetTotalProduct?${params.toString()}`;
      // console.log('GET URL:', fullUrl);
    
      // Gọi API để lấy tổng số sản phẩm
      return this.http.get<number>(fullUrl, { params });
    }
    
    
    getProductById(id: number|undefined): Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}Products/GetById/${id}`);
    }

    deleteProductById(id: number): Observable<void> {
      return this.http.delete<void>(`${environment.apiUrl}Products/Delete/${id}`);
    }

    addProduct(formData: FormData,): Observable<any> {
      return this.http.post<any>(`${environment.apiUrl}Products/Insert`, formData);
    }
    updateProduct(formData: FormData, idproduct:number|0): Observable<any> {
      return this.http.put<any>(`${environment.apiUrl}Products/Update/?id=${idproduct}`, formData);
    }

    deleteImage(id:number|0)
    {
      return this.http.delete(`${environment.apiUrl}Image/${id}`);
    }
    
  }