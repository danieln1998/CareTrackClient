import { createReducer, on } from "@ngrx/store";
import * as alertActions from './alert.actions';
import { AlertState } from "../alert.state";

export const initialState: AlertState = {
  alerts: [],
  hasMoreAlerts: true
};

export const AlertReducer = createReducer(
  initialState,
  on(alertActions.GetAlertsSuccess, (state, { alerts, hasMoreAlerts }) => ({
    ...state,
    alerts: [...alerts],
    hasMoreAlerts
  })),
  on(alertActions.DeleteAlertSuccess, (state, { alertId }) => ({
    ...state,
    alerts: state.alerts.filter(alert => alert.id !== alertId)
  }))
);