import { Injectable } from "@angular/core";
import { Actions,createEffect,ofType } from "@ngrx/effects";
import * as shiftActions from './shift.actions'
import { ShiftService } from "./shift.service";
import { mergeMap , map, catchError, of, tap } from "rxjs";
import * as generalActions from '../general.actions'
import { Router } from "@angular/router";

@Injectable()

export class ShiftEffects{

    addShift$ = createEffect(() => this.actions$.pipe(
        ofType(shiftActions.AddShift),
        mergeMap((action) => this.shiftService.addShift(action.shift)
            .pipe(
                tap((shift) => {
                    this.router.navigate(['/shiftAssignmentAdd', shift.id]);
                }), 
                map(shift => shiftActions.AddShiftSuccess({shift})),
                catchError((error) => of(generalActions.SetErrorMessage({error})))
            ))
    ));

    getShift$ = createEffect(() => this.actions$.pipe(
        ofType(shiftActions.GetShift),
        mergeMap((action) => this.shiftService.getShift(action.shiftId)
            .pipe(
                map(shift => shiftActions.GetShiftSuccess({shift})),
                catchError((error) => of(generalActions.SetErrorMessage({error})))
            ))
    ));

    updateShift$ = createEffect(() => this.actions$.pipe(
        ofType(shiftActions.UpdateShift),
        mergeMap((action) => this.shiftService.updateShift(action.shiftId, action.shift)
            .pipe(
                tap(() => {
                    this.router.navigate(['/shiftList']);
                    window.alert('The shift was updated successfully.');
                }),  
                map(shift => shiftActions.UpdateShiftSuccess({shift})),
                catchError((error) => of(generalActions.SetErrorMessage({error})))
            ))
    ));

    addShiftAssignment$ = createEffect(() => this.actions$.pipe(
        ofType(shiftActions.AddShiftAssignment),
        mergeMap((action) => this.shiftService.addShiftAssignment(action.shiftAssignment)
            .pipe(
                map(() => ({ type: 'Add Shift Assignment Success' })),  
                catchError((error) => of(generalActions.SetErrorMessage({error})))
            ))
    ));

    getShifts$ = createEffect(() => this.actions$.pipe(
        ofType(shiftActions.GetShifts),
        mergeMap((action) => this.shiftService.getShifts(action.pageNumber, action.pageSize, action.sortBy, action.isAscending)
          .pipe(
            map(shifts => shiftActions.GetShiftsSuccess({ shifts, pageSize: action.pageSize })),
            catchError((error) => of(generalActions.SetErrorMessage({ error })))
          ))
      ));

    getShiftAssignments$ = createEffect(() => this.actions$.pipe(
        ofType(shiftActions.GetShiftAssignments),
        mergeMap((action) => this.shiftService.getShiftAssignments(action.shiftId)
          .pipe(
            map(shiftAssignments => shiftActions.GetShiftAssignmentsSuccess({ shiftAssignments })),
            catchError((error) => of(generalActions.SetErrorMessage({ error })))
          ))
      ));

      getShiftsByEmployeeId$ = createEffect(() => this.actions$.pipe(
        ofType(shiftActions.GetShiftsByEmployeeId),
        mergeMap((action) => this.shiftService.getShiftAssignmentsByEmployeeId(
          action.employeeId,
          action.sortBy,
          action.isAscending,
          action.pageNumber,
          action.pageSize
        ).pipe(
          map(shifts => shiftActions.GetShiftsByEmployeeIdSuccess({ shifts , pageSize: action.pageSize })),
          catchError((error) => of(generalActions.SetErrorMessage({ error })))
        ))
      ));


    deleteShiftAssignment$ = createEffect(() => this.actions$.pipe(
        ofType(shiftActions.DeleteShiftAssignment),
        mergeMap((action) => this.shiftService.deleteShiftAssignment(action.shiftAssignmentId)
          .pipe(
            map(() => ({ type: 'Delete Shift Assignment Success' })),
            catchError((error) => of(generalActions.SetErrorMessage({ error })))
          ))
      ));

    deleteShift$ = createEffect(() => this.actions$.pipe(
        ofType(shiftActions.DeleteShift),
        mergeMap((action) => this.shiftService.deleteShift(action.shiftId)
          .pipe(
            tap(() => {
                window.alert('The shift has been deleted successfully.');
            }),
            map(() => shiftActions.DeleteShiftSuccess({ shiftId: action.shiftId })),
            catchError((error) => of(generalActions.SetErrorMessage({ error })))
          ))
      ));

      enterShift$ = createEffect(() => this.actions$.pipe(
        ofType(shiftActions.EnterShift),
        mergeMap((action) => this.shiftService.enterShift(action.employeeId, action.shiftId)
          .pipe(
            tap(() => {
              window.alert('Entering the shift was successful.');
            }),
            map(employeeShift => shiftActions.EnterShiftSuccess({ employeeShift })),
            catchError((error) => of(generalActions.SetErrorMessage({ error })))
          ))
      ));
    
      exitShift$ = createEffect(() => this.actions$.pipe(
        ofType(shiftActions.ExitShift),
        mergeMap((action) => this.shiftService.exitShift(action.employeeShiftId)
          .pipe(
            tap(() => {
              window.alert('Exiting the shift was successful.');
            }),
            map(employeeShift => shiftActions.ExitShiftSuccess({ employeeShift })),
            catchError((error) => of(generalActions.SetErrorMessage({ error })))
          ))
      ));

      getEmployeeShiftByEmployeeId$ = createEffect(() => this.actions$.pipe(
        ofType(shiftActions.GetEmployeeShiftByEmployeeId),
        mergeMap((action) => this.shiftService.getEmployeeShiftByEmployeeId(action.employeeId, action.shiftId)
          .pipe(
            map(employeeShift => shiftActions.GetEmployeeShiftByEmployeeIdSuccess({ employeeShift })),
            catchError((error) => of(generalActions.SetErrorMessage({ error })))
          ))
      ));

      getEmployeeShiftsByShiftId$ = createEffect(() => this.actions$.pipe(
        ofType(shiftActions.GetEmployeeShiftsByShiftId),
        mergeMap((action) => this.shiftService.getEmployeeShiftsByShiftId(action.shiftId)
          .pipe(
            map(employeeShifts => shiftActions.GetEmployeeShiftsByShiftIdSuccess({ employeeShifts })),
            catchError((error) => of(generalActions.SetErrorMessage({ error })))
          ))
      ));


      
    
    constructor(private actions$: Actions , private shiftService:ShiftService,  private router: Router){}
}   