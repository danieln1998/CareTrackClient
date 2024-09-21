import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Alert } from '../models/alert';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertApiUrl = environment.apiUrl + "/api/alerts/";
  private lastCheckedAlertTime: Date | null = null;
  private readonly MAX_TIME_RANGE = 15 * 60 * 1000;
  private readonly MAX_ALERTS = 50; 

  constructor(private http: HttpClient, private authService: AuthenticationService) { 

    this.initLastCheckedAlertTime();

  }

  
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


  private initLastCheckedAlertTime() {
    const savedTime = localStorage.getItem('lastCheckedAlertTime');
    const now = new Date();
    if (savedTime) {
      const parsedTime = new Date(savedTime);
      if (now.getTime() - parsedTime.getTime() > this.MAX_TIME_RANGE) {
        this.lastCheckedAlertTime = new Date(now.getTime() - this.MAX_TIME_RANGE);
      } else {
        this.lastCheckedAlertTime = parsedTime;
      }
    } else {
      this.lastCheckedAlertTime = new Date(now.getTime() - this.MAX_TIME_RANGE);
    }
    localStorage.setItem('lastCheckedAlertTime', this.lastCheckedAlertTime.toISOString());
  }

  checkForNewAlerts(): Observable<Alert[]> {
    const headers = this.authService.getHeaders();
    let params = new HttpParams()
      .set('pageNumber', '1')
      .set('pageSize', this.MAX_ALERTS.toString())
      .set('sortBy', 'Date')
      .set('isAscending', 'false')

    return this.http.get<Alert[]>(this.alertApiUrl, { headers, params }).pipe(
      map(alerts => {
        const newAlerts = alerts.filter(alert => new Date(alert.time) > this.lastCheckedAlertTime!);
        if (newAlerts.length > 0) {
          this.lastCheckedAlertTime = new Date();
          localStorage.setItem('lastCheckedAlertTime', this.lastCheckedAlertTime.toISOString());
        }
        return newAlerts;
      })
    );
  }


  
}