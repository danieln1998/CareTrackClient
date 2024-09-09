
import { createAction, props } from "@ngrx/store";

export const SetErrorMessage = createAction('Error Message', props<{error:any}>());