import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  IInvoice,
  IReservation,
  IInvoiceCreate,
} from '../../interfaces/i-Reservation';
import { environment } from '../../environments/environment';
interface ReturnInvoiceCreate
{
  newInvoiceId:number;
}
@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  constructor(private http: HttpClient) {}
  getInvoice(
    pageIndex: number,
    pageSize: number,
    dateStart: string | null,
    dateEnd: string | null,
    nameCustomer: string | null
  ) {
    let params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());
    const parseAndFormatDate = (dateStr: string | null): string | null => {
      if (!dateStr) return null;
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0]; // Format to 'yyyy-MM-dd'
    };

    const formattedDateStart = parseAndFormatDate(dateStart);
    const formattedDateEnd = parseAndFormatDate(dateEnd);
    if (formattedDateStart) {
      params = params.set('DateStart', formattedDateStart);
    }

    if (formattedDateEnd) {
      params = params.set('DateEnd', formattedDateEnd);
    }

    if (nameCustomer && nameCustomer.trim() !== '') {
      params = params.set('nameCustomer', nameCustomer);
    }

    return this.http.get<any[]>(`${environment.apiUrl}Invoice`, { params });
  }
  getReservationById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}Reservations/${id}`);
  }

  getHourly(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}HourlyRates`);
  }
  createInvoice(invoice: IInvoiceCreate): Observable<ReturnInvoiceCreate> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<ReturnInvoiceCreate>(
      `${environment.apiUrl}Invoice`,
      invoice,
      { headers }
    );
  }
  createReservation(reservation: IReservation): Observable<IReservation> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<IReservation>(
      `${environment.apiUrl}Reservations/Insert`,
      reservation,
      { headers }
    );
  }
}
