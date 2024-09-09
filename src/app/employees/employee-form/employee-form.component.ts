import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/models/employee';
import { select, Store } from '@ngrx/store';
import * as employeeActions from '../employee.actions';
import { AppState } from 'src/app/app.state';
import { Observable } from 'rxjs';
import * as generalActions from '../../general.actions';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit , OnDestroy {
  
  employeeForm: FormGroup = new FormGroup({});
  userId: string | null = null;
  errorMessage$: Observable<string>;
  

  constructor(private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>
  ){

    this.errorMessage$ = this.store.pipe(select(state => state.general.errorMessage));
  }

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      name: ['', Validators.required],
      identificationNumber: ['', Validators.required],
      role: ['', Validators.required]
    });
  
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id){
      this.store.dispatch(employeeActions.GetEmployee({employeeId: id}))
      this.store.pipe(select(state => state.employee.selectedEmployee)).subscribe(employee => {
        this.employeeForm.patchValue(employee as Employee)
      })
      
    }
    else{
      this.userId = this.activatedRoute.snapshot.paramMap.get('userId');
    }
  }

  ngOnDestroy() {
    
    this.store.dispatch(generalActions.SetErrorMessage({error:''}));
    
  }

  onSubmit(){
    if (this.employeeForm.valid){
      const formValue = this.employeeForm.value;
      let name = formValue.name;
      let identificationNumber = formValue.identificationNumber;
      let role = formValue.role;
      
      let id = this.activatedRoute.snapshot.paramMap.get('id');
      
      let employee: Employee = {
        name,
        identificationNumber,
        role
      }
      if (!id && this.userId) {
        employee.userId = this.userId;
      }

      if(id){
        this.store.dispatch(employeeActions.UpdateEmployee({ id, employee }));
      } else {
        this.store.dispatch(employeeActions.AddEmployee(employee));
      }
      
      
    }
  }
}
