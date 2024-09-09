import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, BehaviorSubject, forkJoin, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { AppState } from 'src/app/app.state';
import * as generalActions from '../../general.actions'
import * as shiftActions from '../shift.actions'
import { Employee } from 'src/app/models/employee';
import * as employeeActions from '../../employees/employee.actions'
import { ShiftAssignment } from 'src/app/models/shift-assignment';
import { Shift } from 'src/app/models/shift';

@Component({
  selector: 'app-shift-assignment-form',
  templateUrl: './shift-assignment-form.component.html',
  styleUrls: ['./shift-assignment-form.component.css']
})
export class ShiftAssignmentFormComponent implements OnInit, OnDestroy {
  
  shiftId: string | null = null;
  errorMessage$: Observable<string>;
  employees$: Observable<Employee[]>;
  filteredEmployees$: Observable<Employee[]>;
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  selectedEmployees: Set<string> = new Set();
  existingAssignments: Map<string, ShiftAssignment> = new Map();

  pageNumber: number = 1;
  pageSize: number = 10;
  hasMoreEmployees$: Observable<boolean>;
  pageSizeOptions: number[] = [10, 50, 100];

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router
  ){
    this.errorMessage$ = this.store.pipe(select(state => state.general.errorMessage));
    this.employees$ = this.store.pipe(select(state => state.employee.employee));
    this.filteredEmployees$ = this.employeesSubject.asObservable();
    this.hasMoreEmployees$ = this.store.pipe(select(state => state.employee.hasMoreEmployees));

  }

  ngOnInit(): void {
    this.getEmployees();
    
    this.shiftId = this.activatedRoute.snapshot.paramMap.get('shiftId');
    
    this.employees$.subscribe(employees => {
      const sortedEmployees = [...employees].sort((a, b) => 
        (a.name ?? '').localeCompare(b.name ?? '')
      );
      this.employeesSubject.next(sortedEmployees);
    });

    if (this.shiftId) {
      this.store.dispatch(shiftActions.GetShiftAssignments({ shiftId: this.shiftId }));
      this.store.pipe(select(state => state.shift.shiftAssignments)).subscribe(assignments => {
        this.existingAssignments = new Map(assignments.map(a => [a.employee.id ?? '', a]));
        this.selectedEmployees = new Set(this.existingAssignments.keys());
      });
    }
  }

  ngOnDestroy() {
    this.store.dispatch(generalActions.SetErrorMessage({error:''}));
  }

  getEmployees() {
    this.store.dispatch(employeeActions.GetEmployees({pageNumber: this.pageNumber, pageSize: this.pageSize}));
  }

  filterEmployees(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredEmployees$ = this.employeesSubject.pipe(
      map(employees => employees.filter(employee => 
        employee.name?.toLowerCase().includes(filterValue) ?? false
      ))
    );
  }

  changePageSize(newSize: number) {
    this.pageSize = newSize;
    this.pageNumber = 1;
    this.getEmployees();
  }

  nextPage() {
    this.pageNumber++;
    this.getEmployees();
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getEmployees();
    }
  }

  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const employeeId = checkbox.value;
    
    if (checkbox.checked) {
      this.selectedEmployees.add(employeeId);
    } else {
      this.selectedEmployees.delete(employeeId);
    }
  }

  onSubmit() {
    if (this.shiftId) {
      let shift: Shift = {
        id: this.shiftId
      };
      
      const actions = [];

     
      for (let [employeeId, assignment] of this.existingAssignments) {
        if (!this.selectedEmployees.has(employeeId)) {
          actions.push(
            of(this.store.dispatch(shiftActions.DeleteShiftAssignment({ shiftAssignmentId: assignment.id ?? '' })))
          );
        }
      }
      
      
      for (let employeeId of this.selectedEmployees) {
        if (!this.existingAssignments.has(employeeId)) {
          let employee: Employee = {
            id: employeeId
          }
          let shiftAssignment: ShiftAssignment = {
            employee: employee,
            shift: shift
          };
          actions.push(
            of(this.store.dispatch(shiftActions.AddShiftAssignment({ shiftAssignment })))
          );
        }
      }

      
      forkJoin(actions).pipe(
        take(1),
        catchError(() => {
          return of(null);
        })
      ).subscribe(() => {
        window.alert('Shift assignment saved successfully');
        this.router.navigate(['/shiftList']);
      });
    } 
  }
}