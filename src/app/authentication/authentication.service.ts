import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Authentication } from '../models/authentication';
import { environment } from 'src/environments/environment';
import { HttpClient , HttpHeaders, HttpParams  } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl = environment.apiUrl + "/api/auth/";
   constructor(private http: HttpClient) { }


  login(login: Authentication): Observable<string>{

    return this.http.post<string>(this.apiUrl+'login',login);
    
  }

  unlockAccount (id:string): Observable<void>{
    const headers = this.getHeaders();
    return this.http.put<void>(this.apiUrl+'unlockAccount/' + id, null, {headers});
  }

  updateUserName(userName:string): Observable<void>{
    const headers = this.getHeaders();
    return this.http.put<void>(this.apiUrl+'updateUserName', {userName}, {headers});
  }

  updatePassword(currentPassword:string,newPassword:string): Observable<void>{
    const headers = this.getHeaders();
    return this.http.put<void>(this.apiUrl+'updatePassword' , {currentPassword,newPassword}, {headers});
  }

  logout() {
    
    if (this.getToken()) {
      localStorage.removeItem('jwtToken');
    }
    
  }
  
  
  

  isAuthorized(role:string): Observable<boolean>{

    const jwtToken = this.getToken();
    if (!jwtToken) {
      return of(false);
    }
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('roleRequest', role);

    return this.http.get<boolean>(this.apiUrl + 'isAuthorized', { params, headers }).pipe(
        catchError( () => {
          return of(false)
        })
      );
    
   
  }

  getToken(){
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      return false;
    }
    const parsedToken = JSON.parse(token); 
    const jwtToken = parsedToken.jwtToken;

    return jwtToken;

  }
  getHeaders(){

    const jwtToken = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`,
      responseType: 'blob'
    });
    return headers;

  }

  getRole(){
    const jwtToken = this.getToken();
    if (!jwtToken) {
      return false;
    }
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(jwtToken);
    const role = decodedToken[environment.role];
    if(Array.isArray(role)){
      if(role.length == 2){
        return role[1];
      }
      return role[0];
    }

    return role;

  }

 

}
