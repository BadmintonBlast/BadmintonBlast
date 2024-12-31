import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IPreview } from '../../interfaces/i-Preview';
export interface GetPagedRequest {
  PageIndex: number;
  PageSize: number;
  IdProduct: number;
}
@Injectable({
  providedIn: 'root'
})
export class PreviewService {

  constructor(private http:HttpClient) { }
  getPreviews(request: GetPagedRequest): Observable<IPreview[]> {
    const formData = new FormData();
  
    // Chuyển đổi các thuộc tính của request thành FormData
    Object.keys(request).forEach(key => {
      const value = (request as any)[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
  
    return this.http.post<IPreview[]>(`${environment.apiUrl}Previews/GetPaged`, formData);
  }
  
  getIdPreview(id:number): Observable<IPreview[]> {
    return this.http.get<IPreview[]>(`${environment.apiUrl}Previews/${id}`);
  }
  createPreview(preview: IPreview): Observable<IPreview> {
    return this.http.post<IPreview>(`${environment.apiUrl}Previews/Insert`, preview);
  }
  getidBillPreview(id:number): Observable<IPreview[]> {
    return this.http.get<IPreview[]>(`${environment.apiUrl}Previews/Bill${id}`);
  }
}
