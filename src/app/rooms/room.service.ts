import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '../models/room';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private roomApiUrl = environment.apiUrl + "/api/rooms/";

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  addRoom(room: Room): Observable<Room> {
    const headers = this.authService.getHeaders();
    return this.http.post<Room>(this.roomApiUrl, room, { headers });
  }

  getRooms(pageNumber: number = 1, pageSize: number = 10): Observable<Room[]> {
    const headers = this.authService.getHeaders();
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<Room[]>(this.roomApiUrl, { headers, params });
  }

  getRoom(id: string): Observable<Room> {
    const headers = this.authService.getHeaders();
    return this.http.get<Room>(this.roomApiUrl + id, { headers });
  }

  updateRoom(id: string, room: Room): Observable<Room> {
    const headers = this.authService.getHeaders();
    return this.http.put<Room>(this.roomApiUrl + id, room, { headers });
  }

  deleteRoom(id: string): Observable<void> {
    const headers = this.authService.getHeaders();
    return this.http.delete<void>(this.roomApiUrl + id, { headers });
  }
}