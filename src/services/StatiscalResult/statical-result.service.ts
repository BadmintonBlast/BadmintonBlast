import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IInvoice } from '../../interfaces/i-Reservation';
@Injectable({
  providedIn: 'root',
})
export class StaticalResultService {
  constructor(private http: HttpClient) {}
  getBillStatistics(DateStart: string|null, DateEnd: string|null): Observable<any> {
    const url = `${environment.apiUrl}Bills/statistics?DateStart=${DateStart}&DateEnd=${DateEnd}`;
    return this.http.get<any>(url); // Replace 'any' with the appropriate interface if you have one
  }
  getTotalUniqueProducts(DateStart: string, DateEnd: string): Observable<any> {
    const url = `${environment.apiUrl}Bills/GetTotalUniqueProducts?DateStart=${DateStart}&DateEnd=${DateEnd}`;
    return this.http.get<any>(url); // Replace 'any' with the appropriate interface if you have one
  }
  getInvoiceStatistics(DateStart: string, DateEnd: string): Observable<any> {
    const url = `${environment.apiUrl}Invoice/statisticsInvoice?DateStart=${DateStart}&DateEnd=${DateEnd}`;
    return this.http.get<any>(url); // Replace 'any' with the appropriate interface if you have one
  }

  getStartAndEndOfMonth(): { startOfMonth: Date; endOfMonth: Date } {
    const now: Date = new Date();

    // Lấy ngày đầu tiên của tháng hiện tại
    const startOfMonth: Date = new Date(now.getFullYear(), now.getMonth(), 1);

    // Lấy ngày cuối cùng của tháng hiện tại
    const endOfMonth: Date = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return { startOfMonth, endOfMonth };
  }
  getInvoices(
    pageIndex: number,
    pageSize: number,
    dateStart: string,
    dateEnd: string,
    customerName: string
  ): Observable<IInvoice[]> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString())
      .set('DateStart', dateStart)
      .set('DateEnd', dateEnd)
      .set('CustomerName', customerName);

    return this.http.get<IInvoice[]>(`${environment.apiUrl}Invoice`, { params });
  }
} 
