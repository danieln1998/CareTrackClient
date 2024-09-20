import { Alert } from "./models/alert";

export interface AlertState {
  readonly alerts: Alert[];
  readonly hasMoreAlerts: boolean;
}