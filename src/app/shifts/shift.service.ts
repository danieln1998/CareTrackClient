import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { Shift } from '../models/shift';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ShiftAssignment } from '../models/shift-assignment';
import { EmployeeShift } from '../models/employee-shift';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

  private shiftApiUrl = environment.apiUrl + "/api/shifts/";
  private shiftAssignmentApiUrl = environment.apiUrl + "/api/shiftAssignments/";
  private employeeShiftApiUrl = environment.apiUrl + "/api/employeeShifts/";

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  addShift(shift: Shift): Observable<Shift> {
    const headers = this.authService.getHeaders();
    return this.http.post<Shift>(this.shiftApiUrl, shift, { headers });
  }

  getShift(shiftId: string): Observable<Shift> {
    const headers = this.authService.getHeaders(); 
    return this.http.get<Shift>(this.shiftApiUrl + shiftId, { headers });
  }

  updateShift(shiftId: string, shift: Shift): Observable<Shift> {
    const headers = this.authService.getHeaders();
    return this.http.put<Shift>(this.shiftApiUrl + shiftId, shift, { headers });
  }

  addShiftAssignment(shiftAssignment: ShiftAssignment): Observable<ShiftAssignment> {
    const headers = this.authService.getHeaders();
    return this.http.post<ShiftAssignment>(this.shiftAssignmentApiUrl, {employeeId: shiftAssignment.employee.id, shiftId: shiftAssignment.shift.id}, { headers });
  }


  getShifts(pageNumber: number = 1, pageSize: number = 10, sortBy: string = 'Date', isAscending: boolean = true): Observable<Shift[]> {
    const headers = this.authService.getHeaders();
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('isAscending', isAscending.toString());

    return this.http.get<Shift[]>(this.shiftApiUrl, { headers, params });
  }

  getShiftAssignments(shiftId: string): Observable<ShiftAssignment[]> {
    const headers = this.authService.getHeaders(); 
    return this.http.get<ShiftAssignment[]>(`${this.shiftAssignmentApiUrl}?filterOn=shiftId&filterQuery=${shiftId}`, { headers });
  }

  getShiftAssignmentsByEmployeeId(employeeId: string, sortBy: string = 'Date', isAscending: boolean = true, pageNumber: number = 1, pageSize: number = 10): Observable<Shift[]> {
    const headers = this.authService.getHeaders();
    let params = new HttpParams()
      .set('filterOn', 'EmployeeId')
      .set('filterQuery', employeeId)
      .set('sortBy', sortBy)
      .set('isAscending', isAscending.toString())
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ShiftAssignment[]>(this.shiftAssignmentApiUrl, { headers, params })
      .pipe(
        map(shiftAssignments => shiftAssignments.map(assignment => assignment.shift))
      );
  }


  deleteShiftAssignment(shiftAssignmentId: string): Observable<void> {
    const headers = this.authService.getHeaders();
    return this.http.delete<void>(this.shiftAssignmentApiUrl + shiftAssignmentId, { headers });
  }

  deleteShift(shiftId: string): Observable<void> {
    const headers = this.authService.getHeaders(); 
    return this.http.delete<void>(this.shiftApiUrl + shiftId, { headers });
  }

  enterShift(employeeId: string, shiftId: string): Observable<EmployeeShift> {
    const headers = this.authService.getHeaders();
    return this.http.post<EmployeeShift>(this.employeeShiftApiUrl, { employeeId, shiftId }, { headers });
  }

  exitShift(employeeShiftId: string): Observable<EmployeeShift> {
    const headers = this.authService.getHeaders();
    return this.http.put<EmployeeShift>(this.employeeShiftApiUrl + employeeShiftId, null, { headers });
  }

  getEmployeeShiftByEmployeeId(employeeId: string, shiftId: string): Observable<EmployeeShift | null> {
    const headers = this.authService.getHeaders();
    let params = new HttpParams()
      .set('filterOn', 'ShiftId')
      .set('filterQuery', shiftId)
      .set('filterQueryII', employeeId);
  
    return this.http.get<EmployeeShift[]>(this.employeeShiftApiUrl, { headers, params })
      .pipe(
        map(employeeShifts => employeeShifts.length > 0 ? employeeShifts[0] : null)
      );
  }

  getEmployeeShiftsByShiftId(shiftId: string): Observable<EmployeeShift[]> {
    const headers = this.authService.getHeaders();
    let params = new HttpParams()
      .set('filterOn', 'ShiftId')
      .set('filterQuery', shiftId);
  
    return this.http.get<EmployeeShift[]>(this.employeeShiftApiUrl, { headers, params });
  }



}
