import { Patient } from "./models/patient";

export interface PatientState {
  readonly patients: Patient[];
  readonly selectedPatient: Patient | null;
  readonly hasMorePatients: boolean;
}