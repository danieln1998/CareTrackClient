import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import * as authenticationActions from '../../authentication/authentication.actions';
import * as generalActions from '../../general.actions';
import { passwordValidator } from 'src/app/authentication/validators';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  passwordForm: FormGroup = new FormGroup({});
  usernameForm: FormGroup = new FormGroup({});
  errorMessage$: Observable<string>;

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder
  ) {
    this.errorMessage$ = this.store.pipe(select(state => state.general.errorMessage));
    
  }

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, passwordValidator()]]
    });
    this.usernameForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnDestroy() {
    this.store.dispatch(generalActions.SetErrorMessage({error:''}));
  }

  updatePassword() {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.store.dispatch(authenticationActions.UpdatePassword({ currentPassword, newPassword }));
    }
  }

  updateUsername() {
    if (this.usernameForm.valid) {
      const { userName } = this.usernameForm.value;
      this.store.dispatch(authenticationActions.UpdateUserName({ userName }));
    }
  }
}