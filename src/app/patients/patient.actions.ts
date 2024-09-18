import { createAction, props } from "@ngrx/store";
import { Patient } from "../models/patient";

export const AddPatient = createAction('[Patient] Add Patient', props<Patient>());
export const AddPatientSuccess = createAction('[Patient] Added Patient successfully', props<Patient>());

export const UpdatePatient = createAction('[Patient] Update Patient', props<{id: string, patient: Patient}>());
export const UpdatePatientSuccess = createAction('[Patient] Updated Patient successfully', props<Patient>());

export const GetPatient = createAction('Get Patient', props<{patientId: string}>());
export const GetPatientSuccess = createAction('[Patient] Get Patient successfully', props<{ patient: Patient }>());

export const GetPatients = createAction('Get Patients', props<{pageNumber: number, pageSize: number,filterOn?: string | null, filterQuery?: string | null}>());  
export const GetPatientsSuccess = createAction('[Patient] Get Patients successfully', props<{patients: Patient[], hasMorePatients: boolean}>());

export const DeletePatient = createAction('Delete Patient', props<{patientId: string}>());
export const DeletePatientSuccess = createAction('Delete Patient successfully', props<{patientId: string}>());
