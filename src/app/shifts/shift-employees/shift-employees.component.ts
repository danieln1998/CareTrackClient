import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { ShiftAssignment } from 'src/app/models/shift-assignment';
import * as shiftActions from '../shift.actions';
import { AppState } from 'src/app/app.state';
import * as generalActions from 'src/app/general.actions';
import { EmployeeShift } from 'src/app/models/employee-shift';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-shift-employees',
  templateUrl: './shift-employees.component.html',
  styleUrls: ['./shift-employees.component.css']
})
export class ShiftEmployeesComponent implements OnInit , OnDestroy {
  shiftAssignments$: Observable<ShiftAssignment[]>;
  employeeShifts$: Observable<EmployeeShift[]>;
  shiftId: string | null = null;
  errorMessage$: Observable<string>;
  displayedColumns: string[] = ['employeeName', 'status', 'shiftTimes'];

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private datePipe: DatePipe
  ) {
    this.shiftAssignments$ = this.store.pipe(select(state => state.shift.shiftAssignments));
    this.errorMessage$ = this.store.pipe(select(state => state.general.errorMessage));
    this.employeeShifts$ = this.store.pipe(select(state => state.shift.employeeShifts));
  }

  ngOnInit(): void {
    this.shiftId = this.route.snapshot.paramMap.get('shiftId')!;
    this.store.dispatch(shiftActions.GetShiftAssignments({ shiftId: this.shiftId }));
    this.store.dispatch(shiftActions.GetEmployeeShiftsByShiftId({ shiftId: this.shiftId }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(generalActions.SetErrorMessage({error:''}));
  }

  getShiftTimes(employeeId: string): Observable<string> {
    return this.employeeShifts$.pipe(
      map(shifts => {
        const employeeShift = shifts.find(shift => shift.employee.id === employeeId);
        if (employeeShift) {
          const formatTime = (dateString: string | null) => 
            dateString ? this.datePipe.transform(dateString, 'HH:mm') : 'N/A';
          
          const entryTime = formatTime(employeeShift.startTime!);
          const exitTime = employeeShift.endTime && employeeShift.endTime !== '0001-01-01T00:00:00'
            ? formatTime(employeeShift.endTime!)
            : 'Not exited';
          return `${entryTime} / ${exitTime}`;
        }
        return 'N/A';
      })
    );
  }


}