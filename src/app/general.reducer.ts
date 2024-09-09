import { createReducer, on } from "@ngrx/store";
import * as generalActions from './general.actions'
import { GeneralState } from "./general.state";




export const initialState: GeneralState = {
    errorMessage: ""
};

export const GeneralReducer = createReducer(
    initialState,
    on(generalActions.SetErrorMessage, (state, { error }) => {
        let errorMessage = '';

        const errorDetails = error?.error

        if (typeof errorDetails === 'string') {
            errorMessage = errorDetails;
        } 
        
        if (errorDetails?.errors && typeof errorDetails.errors === 'object') {
            const errorsObj = errorDetails.errors;
            for (const key in errorsObj) {
                if (errorsObj.hasOwnProperty(key) && Array.isArray(errorsObj[key])) {
                    errorsObj[key].forEach((msg: string) => {
                        errorMessage += `${key}: ${msg}\n ,`;
                    });
                }
            }
        } 
        
        if (!errorMessage.trim() && errorDetails?.title) {
            errorMessage = errorDetails.title;
        }
        
       

        return {
            ...state,
            errorMessage: errorMessage.trim()
        };
    })
);

