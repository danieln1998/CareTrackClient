import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alert } from '../models/alert';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertApiUrl = environment.apiUrl + "/api/alerts/";

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  
  getAlerts(pageNumber: number = 1, pageSize: number = 10, filterOn?: string, filterQuery?: string, sortBy?: string, isAscending?: boolean): Observable<Alert[]> {
    const headers = this.authService.getHeaders();
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (filterOn && filterQuery) {
      params = params.set('filterOn', filterOn).set('filterQuery', filterQuery);
    }

   
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    if (isAscending !== undefined) {
      params = params.set('isAscending', isAscending.toString());
    }
    
    return this.http.get<Alert[]>(this.alertApiUrl, { headers, params });
  }



  deleteAlert(id: string): Observable<void> {
    const headers = this.authService.getHeaders();
    return this.http.delete<void>(this.alertApiUrl + id, { headers });
  }

  
}