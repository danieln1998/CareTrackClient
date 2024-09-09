import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as employeeActions from '../employee.actions'
import { Authentication } from 'src/app/models/authentication';
import { Observable, Subscription } from 'rxjs';
import * as generalActions from '../../general.actions'
import { ActivatedRoute } from '@angular/router';
import { passwordValidator } from 'src/app/authentication/validators';

@Component({
  selector: 'app-register-user-form',
  templateUrl: './register-user-form.component.html',
  styleUrls: ['./register-user-form.component.css']
})
export class RegisterUserFormComponent implements OnInit , OnDestroy{
  registerForm: FormGroup = new FormGroup({});
  errorMessage$: Observable<string>;
  isEditMode = false;
  private subscription: Subscription | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute
  ) {

    this.errorMessage$ = this.store.pipe(select(state => state.general.errorMessage));

  }

  ngOnInit(): void {
    let userId = this.activatedRoute.snapshot.paramMap.get('userId');
    this.isEditMode = !!userId;

    this.registerForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator()]],
      role: ['', Validators.required]
    });

    if (this.isEditMode) {
      if(userId){
        this.store.dispatch(employeeActions.GetUser({ userId: userId }));
        this.subscription = this.store.pipe(select(state => state.employee.selectedEmployee)).subscribe(user  => {
          if (user) {
            this.registerForm.patchValue({
              role: this.getRoleFromRoles((user as Authentication).roles!)
            })
            this.registerForm.get('userName')?.disable();
            this.registerForm.get('password')?.disable();
          }
        })
      }
      
    }
  }
  ngOnDestroy() {
    
    this.store.dispatch(generalActions.SetErrorMessage({error:''}))
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  
  registerUser() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      let roles = this.getRolesFromRole(formValue.role);
      let userId = this.activatedRoute.snapshot.paramMap.get('userId');
      if (this.isEditMode) {
        this.store.dispatch(employeeActions.UpdateUserRole({ userId: userId!, roles: roles }));
      } else {
        const newUser: Authentication = {
          userName: formValue.userName,
          password: formValue.password,
          roles
        };
        this.store.dispatch(employeeActions.RegisterUser(newUser));
      }
    }
  }

  getRoleFromRoles(roles: string[]): string {
    if (roles){
    if (roles.includes('Super Admin')) return 'Super Admin';
    if (roles.includes('Admin')) return 'Admin';
    return 'User';
  }
  return '';
  }

  getRolesFromRole(role: string): string[] {
    switch (role) {
      case 'Super Admin':
        return ['Super Admin', 'Admin', 'User'];
      case 'Admin':
        return ['Admin', 'User'];
      case 'User':
      default:
        return ['User'];
    }
  }
}