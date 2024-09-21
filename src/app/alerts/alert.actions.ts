import { createAction, props } from "@ngrx/store";
import { Alert } from "../models/alert";

export const GetAlerts = createAction(
  '[Alert] Get Alerts',
  props<{
    pageNumber: number,
    pageSize: number,
    filterOn?: string,
    filterQuery?: string,
    sortBy?: string,
    isAscending?: boolean
  }>()
);

export const GetAlertsSuccess = createAction(
  '[Alert] Get Alerts Success',
  props<{ alerts: Alert[], hasMoreAlerts: boolean }>()
);

export const DeleteAlert = createAction(
  '[Alert] Delete Alert',
  props<{ alertId: string }>()
);

export const DeleteAlertSuccess = createAction(
  '[Alert] Delete Alert Success',
  props<{ alertId: string }>()
);

export const AddNewAlert = createAction(
  '[Alert] Add New Alert',
  props<{ alert: Alert }>()
);