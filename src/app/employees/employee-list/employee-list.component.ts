import { Component,OnDestroy,OnInit  } from '@angular/core';
import { Store , select} from '@ngrx/store';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Employee } from 'src/app/models/employee';
import * as employeeActions from '../employee.actions'
import { AppState } from 'src/app/app.state';
import * as generalActions from '../../general.actions'
import * as authenticationActions from '../../authentication/authentication.actions'



@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit , OnDestroy{

  employees$: Observable<Employee[]>;
  displayedColumns: string[] = ['name', 'identificationNumber', 'role', 'actions'];
  errorMessage$: Observable<string>;
  pageNumber: number = 1;
  pageSize: number = 10;
  hasMoreEmployees$: Observable<boolean>;
  pageSizeOptions: number[] = [10, 50, 100];
  filteredEmployees$: Observable<Employee[]>;
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  

  constructor(private store:Store<AppState>){

    this.employees$ = this.store.pipe(select(state => state.employee.employee));
    this.errorMessage$ = this.store.pipe(select(state => state.general.errorMessage));
    this.hasMoreEmployees$ = this.store.pipe(select(state => state.employee.hasMoreEmployees));
    this.filteredEmployees$ = this.employeesSubject.asObservable();
  
  }
  ngOnInit(): void {
    this.getEmployees();
    this.employees$.subscribe(employees => {
      const sortedEmployees = [...employees].sort((a, b) => 
        (a.name ?? '').localeCompare(b.name ?? '')
      );
      this.employeesSubject.next(sortedEmployees);
    });
   

  }

  ngOnDestroy() {
    
    this.store.dispatch(generalActions.SetErrorMessage({error:''}));
  }

  getEmployees(){
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

  deleteEmployee(employeeId: string, userId: string){
    const isConfirmed = confirm('Are you sure you want to delete this employee?');
    if (isConfirmed) {
      this.store.dispatch(employeeActions.DeleteEmployee({employeeId}));
      this.store.dispatch(employeeActions.DeleteUser({userId}));
    }
  }

  unlockAccount(userId: string){
    this.store.dispatch(authenticationActions.UnlockAccount({userId}));
  }



}
