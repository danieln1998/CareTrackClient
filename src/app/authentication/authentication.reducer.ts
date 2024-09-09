import { createReducer, on } from "@ngrx/store";
import * as authenticationActions from './authentication.actions'
import { AuthState } from "../auth.state";



export const initialState: AuthState = {
    isLoginRoute: false
  }
  
  export const AuthenticationReducer = createReducer(
    initialState,
    on(authenticationActions.LoginSuccess, (state) => ({
      ...state,
      isLoginRoute: false,
      
      
    })),
    on(authenticationActions.LoginRoute, (state) => ({
        ...state,
        isLoginRoute: true
        
      }))
   
  )