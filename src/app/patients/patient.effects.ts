import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as patientActions from './patient.actions';
import { PatientService } from "./patient.service";
import { mergeMap, map, catchError, of, tap } from "rxjs";
import * as generalActions from '../general.actions';
import { Router } from "@angular/router";

@Injectable()
export class PatientEffects {

  addPatient$ = createEffect(() => this.actions$.pipe(
    ofType(patientActions.AddPatient),
    mergeMap((action) => this.patientService.addPatient(action)
      .pipe(
        tap(() => {
          this.router.navigate(['/patientList']);
          window.alert('The patient was added successfully.');
        }),
        map(patient => patientActions.AddPatientSuccess(patient)),
        catchError((error) => of(generalActions.SetErrorMessage({error})))
      ))
  ));

  getPatients$ = createEffect(() => this.actions$.pipe(
    ofType(patientActions.GetPatients),
    mergeMap((action) => this.patientService.getPatients(
      action.pageNumber, 
      action.pageSize, 
      action.filterOn, 
      action.filterQuery
    ).pipe(
      map(patients => patientActions.GetPatientsSuccess({ 
        patients, 
        hasMorePatients: patients.length >= action.pageSize 
      })),
      catchError((error) => of(generalActions.SetErrorMessage({ error })))
    ))
  ));

  getPatient$ = createEffect(() => this.actions$.pipe(
    ofType(patientActions.GetPatient),
    mergeMap((action) => this.patientService.getPatient(action.patientId).pipe(
      map(patient => patientActions.GetPatientSuccess({patient})),
      catchError((error) => of(generalActions.SetErrorMessage({ error })))
    ))
  ));

  updatePatient$ = createEffect(() => this.actions$.pipe(
    ofType(patientActions.UpdatePatient),
    mergeMap((action) => this.patientService.updatePatient(action.id, action.patient).pipe(
      tap(() => {
        this.router.navigate(['/patientList']);
        window.alert('The patient was updated successfully.');
      }),
      map(patient => patientActions.UpdatePatientSuccess(patient)),
      catchError((error) => of(generalActions.SetErrorMessage({ error })))
    ))
  ));

  deletePatient$ = createEffect(() => this.actions$.pipe(
    ofType(patientActions.DeletePatient),
    mergeMap((action) => this.patientService.deletePatient(action.patientId).pipe(
      tap(() => {
        window.alert('The patient was deleted successfully.');
      }),
      map(() => patientActions.DeletePatientSuccess({ patientId: action.patientId })),
      catchError((error) => of(generalActions.SetErrorMessage({ error })))
    ))
  ));

  constructor(
    private actions$: Actions,
    private patientService: PatientService,
    private router: Router
  ) {}
}