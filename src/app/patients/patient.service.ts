import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private patientApiUrl = environment.apiUrl + "/api/patients/";

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  addPatient(patient: Patient): Observable<Patient> {
    const headers = this.authService.getHeaders();
    const patientData = {
      identificationNumber: patient.identificationNumber,
      name: patient.name,
      roomId: patient.room?.id,
      deviceId: patient.device?.id
    };
    return this.http.post<Patient>(this.patientApiUrl, patientData, { headers });
  }
  
  updatePatient(id: string, patient: Patient): Observable<Patient> {
    const headers = this.authService.getHeaders();
    const patientData = {
      identificationNumber: patient.identificationNumber,
      name: patient.name,
      roomId: patient.room?.id,
      deviceId: patient.device?.id
    };
    return this.http.put<Patient>(this.patientApiUrl + id, patientData, { headers });
  }

  getPatients(pageNumber: number = 1, pageSize: number = 10, filterOn?: string | null, filterQuery?: string | null): Observable<Patient[]> {
    const headers = this.authService.getHeaders();
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    if (filterOn && filterQuery) {
      params = params.set('filterOn', filterOn).set('filterQuery', filterQuery);
    }
    
    return this.http.get<Patient[]>(this.patientApiUrl, { headers, params });
  }


  getPatient(id: string): Observable<Patient> {
    const headers = this.authService.getHeaders();
    return this.http.get<Patient>(this.patientApiUrl + id, { headers });
  }

  

  deletePatient(id: string): Observable<void> {
    const headers = this.authService.getHeaders();
    return this.http.delete<void>(this.patientApiUrl + id, { headers });
  }
}