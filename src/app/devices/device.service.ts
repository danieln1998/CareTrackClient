import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from '../models/device';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private deviceApiUrl = environment.apiUrl + "/api/devices/";
  
  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  addDevice(device: Device): Observable<Device> {
    const headers = this.authService.getHeaders();
    return this.http.post<Device>(this.deviceApiUrl, device, { headers });
  }


  getDevices(pageNumber: number = 1, pageSize: number = 10): Observable<Device[]> {
    const headers = this.authService.getHeaders();
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<Device[]>(this.deviceApiUrl, { headers, params });
  }

  getDevice(id: string): Observable<Device> {
    const headers = this.authService.getHeaders();
    return this.http.get<Device>(this.deviceApiUrl + id, { headers });
  }

  updateDevice(id: string, device: Device): Observable<Device> {
    const headers = this.authService.getHeaders();
    return this.http.put<Device>(this.deviceApiUrl + id, device, { headers });
  }

  deleteDevice(id: string): Observable<void> {
    const headers = this.authService.getHeaders();
    return this.http.delete<void>(this.deviceApiUrl + id, { headers });
  }
}