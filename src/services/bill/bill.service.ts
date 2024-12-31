import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IBill } from '../../interfaces/i-Bill';
import { IBillDetail } from '../../interfaces/i-Bill';
import { responseBill } from '../../interfaces/i-Bill';
@Injectable({
  providedIn: 'root',
})
export class BillService {
  constructor(private http: HttpClient) {}

  // Phương thức để lấy danh sách hóa đơn với các tham số truyền vào
  getBills(
    pageIndex: number,
    pageSize: number,
    dateStart: string | null,
    dateEnd: string | null,
    status: number | null,
    keyword: string | null
  ): Observable<any> {
    let params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());

    if (dateStart) {
      params = params.set('DateStart', dateStart);
    }

    if (dateEnd) {
      params = params.set('DateEnd', dateEnd);
    }

    if (status !== null) {
      params = params.set('status', status.toString());
    }
    if (keyword !== null) {
      params = params.set('keyword', keyword);
    }
    return this.http.get(`${environment.apiUrl}Bills`, { params });
  }
 
  insertBills(bills: IBill): Observable<responseBill> {
    return this.http.post<responseBill>(`${environment.apiUrl}Bills/Insert`, bills);
  }

  getBillsByCustomer(idCustomer: number, status?: number): Observable<IBillDetail[]> {
    let params = new HttpParams().set('IdCustomer', idCustomer.toString());

    if (status !== undefined) {
      params = params.set('Status', status.toString());
    } 

    return this.http.get<IBillDetail[]>(`${environment.apiUrl}Bills/customer`, { params });
  }

  getTotalBill(
    dateStart: string | null,
    dateEnd: string | null,
    status: number | null,
    keyword: string | null
  ): Observable<number> {
    let params = new HttpParams();

    if (dateStart) {
      params = params.set('DateStart', dateStart);
    }
    if (dateEnd) {
      params = params.set('DateEnd', dateEnd);
    }
    if (status !== null) {
      params = params.set('status', status.toString());
    }
    if (keyword !== null) {
      params = params.set('keyword', keyword);
    }

    return this.http.get<number>(`${environment.apiUrl}Bills/GetTotalBill`, {
      params,
    });
  }
  updateBillStatus(idBill: number, status: number): Observable<any> {
    const url = `${environment.apiUrl}Bills/${idBill}/status/${status}`;
    return this.http.put(url, {}); // Truyền body là một object rỗng
  }
  
  
  getBillId(idBill:number)
  {
    return this.http.get<IBillDetail>(`${environment.apiUrl}Bills/${idBill}`);
  }
}
