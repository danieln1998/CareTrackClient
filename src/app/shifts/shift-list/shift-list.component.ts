import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of, take } from 'rxjs';
import { Shift } from 'src/app/models/shift';
import * as shiftActions from '../shift.actions';
import { AppState } from 'src/app/app.state';
import * as generalActions from 'src/app/general.actions';
import { ActivatedRoute } from '@angular/router';
import * as employeeActions from 'src/app/employees/employee.actions';
import { EmployeeShift } from 'src/app/models/employee-shift';

@Component({
  selector: 'app-shift-list',
  templateUrl: './shift-list.component.html',
  styleUrls: ['./shift-list.component.css']
})
export class ShiftListComponent implements OnInit , OnDestroy {
  shifts$: Observable<Shift[]>;
  groupedShifts: Map<string, Shift[]> = new Map();
  groupedShiftDates: string[] = [];
  selectedDate: string | null = null;
  errorMessage$: Observable<string>;
  pageNumber: number = 1;
  pageSize: number = 10;
  sortBy: string = 'Date';
  isAscending: boolean = false;
  hasMoreShifts$: Observable<boolean>;
  pageSizeOptions: number[] = [10, 50, 100];
  isUserView: boolean = false;
  currentEmployeeId$: Observable<string | null>;
  selectedShiftId: string | null = null;
  employeeShift$: Observable<EmployeeShift | null>;

  constructor(private store: Store<AppState>,private route: ActivatedRoute) {
    this.shifts$ = this.store.pipe(select(state => state.shift.shift));
    this.errorMessage$ = this.store.pipe(select(state => state.general.errorMessage));
    this.hasMoreShifts$ = this.store.pipe(select(state => state.shift.hasMoreShifts));
    this.currentEmployeeId$ = this.store.pipe(select(state => state.employee.currentEmployeeId));
    this.employeeShift$ = this.store.pipe(select(state => state.shift.employeeShift));
  }

  ngOnInit(): void {
    this.isUserView = this.route.snapshot.routeConfig?.path === 'shifts';
    if (this.isUserView) {
      this.store.dispatch(employeeActions.GetEmployeeIdByUserId());
      this.currentEmployeeId$.subscribe(employeeId => {
        if (employeeId) {
          this.getShiftsByEmployeeId(employeeId);
        }
      });
    } else {
      this.getShifts();
    }

    this.shifts$.subscribe(shifts => {
      this.groupShiftsByDate(shifts);
    });
  }

  ngOnDestroy() {
    
    this.store.dispatch(generalActions.SetErrorMessage({error:''}));
  }

  getShifts() {
    this.store.dispatch(shiftActions.GetShifts({pageNumber:this.pageNumber,pageSize:this.pageSize,sortBy:this.sortBy,isAscending:this.isAscending}));
  }

  getShiftsByEmployeeId(employeeId: string) {
    this.store.dispatch(shiftActions.GetShiftsByEmployeeId({
      employeeId,
      sortBy: this.sortBy,
      isAscending: this.isAscending,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    }));
  }

  changePageSize(newSize: number) {
    this.pageSize = newSize;
    this.pageNumber = 1; 
    this.loadShifts();
    
  }

  groupShiftsByDate(shifts: Shift[]) {
    this.groupedShifts = new Map();
    this.groupedShiftDates = [];
    shifts.forEach(shift => {
      const date = this.formatDate(new Date(shift.startTime!));
      if (!this.groupedShifts.has(date)) {
        this.groupedShifts.set(date, []);
        this.groupedShiftDates.push(date);
      }
      this.groupedShifts.get(date)!.push(shift);
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

 

  onDateInputChange(event: Event) {
    const target = event.target as HTMLInputElement
    this.selectDate(target.value)
  }

  selectDate(date: string) {
    if (date) {
      const selectedDate = new Date(date);
      this.selectedDate = this.formatDate(selectedDate);
    } else {
      this.selectedDate = null;
    }
  }
 

  clearDateFilter() {
    this.selectedDate = null;
  }

  deleteShift(shiftId: string) {
    const isConfirmed = confirm('Are you sure you want to delete this shift?');
    if (isConfirmed) {
      this.store.dispatch(shiftActions.DeleteShift({ shiftId }));
    }
  }

  
  nextPage() {
    this.pageNumber++;
    this.loadShifts();
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadShifts();
    }
  }

  sortShifts() {
    this.isAscending = !this.isAscending;
    this.loadShifts();
  }

  private loadShifts() {
    if (this.isUserView) {
      this.currentEmployeeId$.pipe(take(1)).subscribe(employeeId => {
        if (employeeId) {
          this.getShiftsByEmployeeId(employeeId);
        }
      });
    } else {
      this.getShifts();
    }
  }

  onActionsOnShift(shiftId: string) {
    this.selectedShiftId = shiftId;
    this.currentEmployeeId$.pipe(take(1)).subscribe(employeeId => {
      if (employeeId) {
        this.store.dispatch(shiftActions.GetEmployeeShiftByEmployeeId({ employeeId, shiftId }));
      }
    });
  }

  canEnterShift(): boolean {
    let canEnter = true;
    this.employeeShift$.pipe(take(1)).subscribe(employeeShift => {
      if (employeeShift && employeeShift.startTime) {
        canEnter = false;
      }
    });
    return canEnter;
  }

  canExitShift(): boolean {
    let canExit = false;
    this.employeeShift$.pipe(take(1)).subscribe(employeeShift => {
      if (employeeShift && employeeShift.startTime && !this.isDefaultEndTime(employeeShift.endTime)) {
        canExit = false;
      } else if (employeeShift && employeeShift.startTime) {
        canExit = true;
      }
    });
    return canExit;
  }

  isDefaultEndTime(endTime: string | undefined): boolean {
    return endTime === '0001-01-01T00:00:00';
  }

  enterShift() {
    if (this.selectedShiftId) {
      this.currentEmployeeId$.pipe(take(1)).subscribe(employeeId => {
        if (employeeId) {
          this.store.dispatch(shiftActions.EnterShift({ employeeId, shiftId: this.selectedShiftId! }));
        }
      });
    }
  }

  exitShift() {
    this.employeeShift$.pipe(take(1)).subscribe(employeeShift => {
      if (employeeShift && employeeShift.id) {
        this.store.dispatch(shiftActions.ExitShift({ employeeShiftId: employeeShift.id }));
      }
    });
  }

}