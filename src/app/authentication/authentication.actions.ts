import { createAction, props } from "@ngrx/store";
import { Authentication } from "../models/authentication";



export const Login = createAction('[Authentication] Login',props<Authentication>());
export const LoginSuccess = createAction('Login successfully');

export const UnlockAccount = createAction('Unlock Account',props<{userId:string}>());

export const UpdateUserName = createAction('Update User Name',props<{userName:string}>());
export const UpdatePassword = createAction('Update Password',props<{currentPassword:string,newPassword:string}>());


export const LoginRoute= createAction('is Login Route');