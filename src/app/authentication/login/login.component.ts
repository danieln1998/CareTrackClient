import { Component , OnDestroy, OnInit} from '@angular/core';
import { Store , select} from '@ngrx/store';
import * as authenticationActions from '../authentication.actions'
import { Authentication } from 'src/app/models/authentication';
import { AppState } from 'src/app/app.state';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as generalActions from '../../general.actions'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})
export class LoginComponent implements OnInit , OnDestroy {

  loginForm: FormGroup = new FormGroup({});
  errorMessage$: Observable<string>;

  constructor(private store:Store<AppState>,private formBuilder: FormBuilder,private router: Router){
    this.errorMessage$ = this.store.pipe(select(state => state.general.errorMessage));
    
  }
  
  ngOnInit(): void {
    
    const token = localStorage.getItem('jwtToken');
    if (token) {
      this.router.navigate(['/dashboard']);
    
    }
    
    this.store.dispatch(authenticationActions.LoginRoute());
    
    
    this.loginForm = this.formBuilder.group({
      userName:['',[Validators.required, Validators.email]],
      password:['',[Validators.required]]

    });
   
  }


  
  ngOnDestroy() {
    
    this.store.dispatch(generalActions.SetErrorMessage({error:''}));
  }

  login(){

    if (this.loginForm.valid){
      let login: Authentication = this.loginForm.value;
      let userName = login.userName;
      let password = login.password;
      this.store.dispatch(authenticationActions.Login ({userName,password}));

    }
  }

}
