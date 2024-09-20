import { Patient } from './patient';

export interface Alert {
  id: string;
  name: string;
  time: Date;
  patient: Patient;
}