import { Injectable } from "@angular/core";
import { Actions,createEffect,ofType } from "@ngrx/effects";
import * as authenticationActions from './authentication.actions'
import * as generalActions from '../general.actions'
import { AuthenticationService } from "./authentication.service";
import { mergeMap , map, catchError, of, tap } from "rxjs";
import { Router } from '@angular/router';

@Injectable()

export class AuthenticationEffects{

    login$ = createEffect(() => this.actions$.pipe(
        ofType(authenticationActions.Login),
        mergeMap((action) => this.authenticationService.login(action)
            .pipe(
                tap(jwtToken => {
                    localStorage.setItem("jwtToken", JSON.stringify(jwtToken));
                    this.router.navigate(['/dashboard']); 
                }),
                map(() => authenticationActions.LoginSuccess()),
                catchError((error) => of(generalActions.SetErrorMessage({ error })))
            ))
    ));

    unlockAccount$ = createEffect(() => this.actions$.pipe(
        ofType(authenticationActions.UnlockAccount),
        mergeMap((action) => this.authenticationService.unlockAccount(action.userId)
            .pipe(
                tap(() => {
                    window.alert('The account has been unlocked successfully.');
                }),
                map(() => ({ type: 'Unlock Account Success' })),
                catchError((error) => of(generalActions.SetErrorMessage({ error })))
            ))
    ));

    updateUserName$ = createEffect(() => this.actions$.pipe(
        ofType(authenticationActions.UpdateUserName),
        mergeMap((action) => this.authenticationService.updateUserName(action.userName)
            .pipe(
                tap(() => {
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                        this.router.navigate(['/accountSettings']);
                    })
                    window.alert('The user name has been updated successfully.');
                }),
                map(() => ({ type: 'Update User Name Success' })),  
                catchError((error) => of(generalActions.SetErrorMessage({ error })))
            ))
    ));

    updatePassword$ = createEffect(() => this.actions$.pipe(
        ofType(authenticationActions.UpdatePassword),
        mergeMap((action) => this.authenticationService.updatePassword(action.currentPassword, action.newPassword)
            .pipe(  
                tap(() => {
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                        this.router.navigate(['/accountSettings']);
                    })
                    window.alert('The password has been updated successfully.');
                }),
                map(() => ({ type: 'Update Password Success' })),
                catchError((error) => of(generalActions.SetErrorMessage({ error })))
            ))
    ));


    constructor(private actions$: Actions , private authenticationService:AuthenticationService, private router:Router){}
}