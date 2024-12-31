import { Injectable, Inject } from '@angular/core';
import { ICustomer } from '../../interfaces/i-Customers';
import { BehaviorSubject, Observable, map, catchError, of } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  constructor( 
    private http: HttpClient,  
    @Inject(PLATFORM_ID) private platformId: Object,
    private jwtHelper: JwtHelperService) { }

  // userInfo = new BehaviorSubject(null);

  getCustomers(pageIndex: number, pageSize: number, keyword?: string): Observable<ICustomer[]> {
    let params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());
  
    if (keyword && keyword.trim()) {
      params = params.set('Keyword', keyword);
    }
  
    return this.http.get<ICustomer[]>(`${environment.apiUrl}Customers/GetCustomers`, { params });
  }

  getTotalCustomers(keyword?: string): Observable<number> {
    let params = new HttpParams();
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    return this.http.get<number>(`${environment.apiUrl}Customers/GetTotalCustomers`, { params });
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}Customers/Delete/${id}`);
  }

  insertCustomer(formData: FormData): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}Customers/Insert`, formData);
  }
  getEmail(email:string)
  {
    return this.http.get<string>(`${environment.apiUrl}Customers/GetByEmail/${email}`);
  }
  insertlogin(email: string, password: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };
  
    return this.http.post<{ token: string,role:string }>(`${environment.apiUrl}Customers/login`, body, { headers }).pipe(
      map((res) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('user-token', res.token);
          localStorage.setItem('role',res.role)
        }
        return 'Đăng nhập thành công';
      }),
      catchError((error) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('user-token');
        }
        return of('Đăng nhập thất bại');
      })
    );
  }

  removeToken(): void {
    localStorage.removeItem('user-token');
    localStorage.removeItem('role');
  }
  changePassword(email: string, password: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };
    console.log(body);
    return this.http.post<string>(`${environment.apiUrl}Customers/UpdatePassWord`,body,{ headers })
  }
  updateCustomer(id: number, customer: FormData): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}Customers/Update/${id}`, customer);
  }

  getCustomerId(customerId: number): Observable<ICustomer> {
    return this.http.get<ICustomer>(`${environment.apiUrl}Customers/GetById/${customerId}`);
  }

  getClaimValue(): number | 0 {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('user-token');
      const claimName = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';

      if (token) {
        try {
          const decodedToken = this.jwtHelper.decodeToken(token);
          const claimValue = decodedToken[claimName];
  
          return claimValue;
        } catch (error) {
          console.error('Error decoding token:', error);
          return 0;
        }
      } else {
        return 0;
      }
    } else {
      console.warn('Not running in the browser environment.');
      return 0;
    }
  }
}
