import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient , HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  private apiUrl = 'https://api.zerobounce.net/v2/validate'; // Đặt URL API của ZeroBounce

  constructor(private http: HttpClient) {} 
// check strong for password
  checkStrongPassword(password: string): boolean {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongRegex.test(password);
  }
// Check email 
  validateEmail(email: string): Observable<Object> {
    const params = new HttpParams()
      .set('api_key', environment.ZeroBounce.apiKey) 
      .set('email', email);

      return this.http.get(`${environment.apiUrl}validate`, { params });
  }
}


