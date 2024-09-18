import { createReducer, on } from "@ngrx/store";
import * as patientActions from './patient.actions';
import { PatientState } from "../patient.state";

export const initialState: PatientState = {
  patients: [],
  selectedPatient: null,
  hasMorePatients: true
};

export const PatientReducer = createReducer(
  initialState,
  
  on(patientActions.AddPatientSuccess, (state, patient) => ({
    ...state,
    patients: [...state.patients, patient]
  })),

  on(patientActions.GetPatientsSuccess, (state, { patients, hasMorePatients }) => ({
    ...state,
    patients: [...patients],
    hasMorePatients
  })),

  on(patientActions.UpdatePatientSuccess, (state, updatedPatient) => ({
    ...state,
    patients: state.patients.map(patient => patient.id === updatedPatient.id ? updatedPatient : patient)
  })),

  on(patientActions.DeletePatientSuccess, (state, { patientId }) => ({
    ...state,
    patients: state.patients.filter(patient => patient.id !== patientId)
  })),
  
  on(patientActions.GetPatientSuccess, (state, { patient }) => ({
    ...state,
    selectedPatient: patient
  }))
  
  
);