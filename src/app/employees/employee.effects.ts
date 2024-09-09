import { Injectable } from "@angular/core";
import { Actions,createEffect,ofType } from "@ngrx/effects";
import * as employeeActions from './employee.actions'
import { EmployeeService } from "./employee.service";
import { mergeMap , map, catchError, of, tap } from "rxjs";
import * as generalActions from '../general.actions'
import { Router } from "@angular/router";

@Injectable()

export class EmployeeEffects{

    addEmployee$ = createEffect(() => this.actions$.pipe(
        ofType(employeeActions.AddEmployee),
        mergeMap((action) => this.employeeService.addEmployee(action)
            .pipe(
                tap(() => {
                    this.router.navigate(['/employeeList']);
                    window.alert('The employee was added successfully.');
                }),
                map(employee => employeeActions.AddEmployeeSuccess(employee)),
                catchError((error) => of(generalActions.SetErrorMessage({error})))
            ))
    ));

    getEmployees$ = createEffect(() => this.actions$.pipe(
        ofType(employeeActions.GetEmployees),
        mergeMap((action) => this.employeeService.getEmployees(action.pageNumber, action.pageSize)
          .pipe(
            map(employees => employeeActions.GetEmployeesSuccess({ 
              employees, 
              hasMoreEmployees: employees.length >= action.pageSize 
            })),
            catchError((error) => of(generalActions.SetErrorMessage({ error })))
          )
        )
      ));

    registerUser$ = createEffect(() => this.actions$.pipe(
        ofType(employeeActions.RegisterUser),
        mergeMap((action) => this.employeeService.registerUser(action).pipe(
          tap(response => {
            const userId = response.userId;
            this.router.navigate(['/employeeAdd', userId ]);
          }),
          map(() => ({ type: 'Registration Success' })),
          catchError((error) => of(generalActions.SetErrorMessage({ error })))
        ))
      ));

    getEmployee$ = createEffect(() => this.actions$.pipe(
        ofType(employeeActions.GetEmployee),
        mergeMap((action) => this.employeeService.getEmployee(action.employeeId).pipe(
            map(employee => employeeActions.GetEmployeeSuccess({employee})),
            catchError((error) => of(generalActions.SetErrorMessage({ error })))
        ))
    ));

    updateEmployee$ = createEffect(() => this.actions$.pipe(
        ofType(employeeActions.UpdateEmployee),
        mergeMap((action) => this.employeeService.updateEmployee(action.id, action.employee).pipe(
            tap(() => {
                this.router.navigate(['/employeeList']);
                window.alert('The employee has been updated successfully.');
            }),
            map(employee => employeeActions.UpdateEmployeeSuccess(employee)),
            catchError((error) => of(generalActions.SetErrorMessage({ error })))
        ))
    ));

    deleteEmployee$ = createEffect(() => this.actions$.pipe(
        ofType(employeeActions.DeleteEmployee),
        mergeMap((action) => this.employeeService.deleteEmployee(action.employeeId).pipe(
            map(() => employeeActions.DeleteEmployeeSuccess({ employeeId: action.employeeId })),
            catchError((error) => of(generalActions.SetErrorMessage({ error })))
        ))
    ));

    deleteUser$ = createEffect(() => this.actions$.pipe(
        ofType(employeeActions.DeleteUser),
        mergeMap((action) => this.employeeService.deleteUser(action.userId).pipe(
            tap(() => {
                window.alert('The employee has been deleted successfully.');
            }),
            map(() => ({ type: 'Delete User Success' })),
            catchError((error) => of(generalActions.SetErrorMessage({ error })))
        ))
    ));

    getUser$ = createEffect(() => this.actions$.pipe(
        ofType(employeeActions.GetUser),
        mergeMap((action) => this.employeeService.getUser(action.userId).pipe(
            map(user => employeeActions.GetUserSuccess({ user })),
            catchError((error) => of(generalActions.SetErrorMessage({ error })))
        ))
    ));

    updateUserRole$ = createEffect(() => this.actions$.pipe(
        ofType(employeeActions.UpdateUserRole),
        mergeMap((action) => this.employeeService.updateUserRole(action.userId, action.roles).pipe(
            tap(() => {
                this.router.navigate(['/employeeList']);
                window.alert('The employee permission has been updated successfully.');
            }),
            map(() => ({ type: 'Update User Role Success' })),
            catchError((error) => of(generalActions.SetErrorMessage({ error })))
        ))
    ));

    getEmployeeIdByUserId$ = createEffect(() => this.actions$.pipe(
        ofType(employeeActions.GetEmployeeIdByUserId),
        mergeMap(() => this.employeeService.getEmployeeIdByUserId().pipe(
          map(response => employeeActions.GetEmployeeIdByUserIdSuccess({ employeeId: response.employeeId })),
          catchError((error) => of(generalActions.SetErrorMessage({ error })))
        ))
      ));



    constructor(private actions$: Actions , private employeeService:EmployeeService,  private router: Router){}
}