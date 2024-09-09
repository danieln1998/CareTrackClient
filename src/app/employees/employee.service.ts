import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { Authentication } from '../models/authentication';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

   private employeeApiUrl = environment.apiUrl + "/api/employees/";
   private authApiUrl = environment.apiUrl + "/api/auth/";
   constructor(private http: HttpClient, private authService: AuthenticationService) { }



   registerUser(user: Authentication): Observable<any>{

    const headers = this.authService.getHeaders();
    return this.http.post<any>(this.authApiUrl + 'register',user, {headers});

  }


  addEmployee(employee: Employee): Observable<Employee>{

    const headers = this.authService.getHeaders();
    return this.http.post<Employee>(this.employeeApiUrl,employee, {headers});
   
  }

  getEmployees(pageNumber: number = 1, pageSize: number = 10): Observable<Employee[]> {
    const headers = this.authService.getHeaders();
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<Employee[]>(this.employeeApiUrl, {headers, params});
  }

  getEmployee(id: string): Observable<Employee>{
    const headers = this.authService.getHeaders();
    return this.http.get<Employee>(this.employeeApiUrl+ id, {headers});
  }

  updateEmployee(id: string, employee: Employee): Observable<Employee>{
    const headers = this.authService.getHeaders();
    return this.http.put<Employee>(this.employeeApiUrl+ id, employee, {headers});
  }

  deleteEmployee(id: string): Observable<void>{
    const headers = this.authService.getHeaders();
    return this.http.delete<void>(this.employeeApiUrl+ id, {headers});
  }

  deleteUser(id: string): Observable<void>{
    const headers = this.authService.getHeaders();
    return this.http.delete<void>(this.authApiUrl+ 'delete/'+ id, {headers});
  }

  getUser(id: string): Observable<Authentication>{
    const headers = this.authService.getHeaders();
    return this.http.get<Authentication>(this.authApiUrl+ 'getbyid/'+ id, {headers});
  }

  updateUserRole(id: string, roles: string[]): Observable<void>{
    const headers = this.authService.getHeaders();
    return this.http.put<void>(this.authApiUrl+ 'updateroles/'+ id,  { roles }, {headers});
  }

  getEmployeeIdByUserId(): Observable<{ employeeId: string }> {
    const headers = this.authService.getHeaders();
    return this.http.get<{ employeeId: string }>(this.employeeApiUrl + 'GetEmployeeByUserId', { headers });
  }



}
