import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as alertActions from './alert.actions';
import { AlertService } from "./alert.service";
import { mergeMap, map, catchError, of, tap } from "rxjs";
import * as generalActions from '../general.actions';

@Injectable()
export class AlertEffects {
  getAlerts$ = createEffect(() => this.actions$.pipe(
    ofType(alertActions.GetAlerts),
    mergeMap((action) => this.alertService.getAlerts(
      action.pageNumber,
      action.pageSize,
      action.filterOn,
      action.filterQuery,
      action.sortBy,
      action.isAscending
    ).pipe(
      map(alerts => alertActions.GetAlertsSuccess({
        alerts,
        hasMoreAlerts: alerts.length >= action.pageSize
      })),
      catchError((error) => of(generalActions.SetErrorMessage({ error })))
    ))
  ));

  deleteAlert$ = createEffect(() => this.actions$.pipe(
    ofType(alertActions.DeleteAlert),
    mergeMap((action) => this.alertService.deleteAlert(action.alertId).pipe(
      tap(() => {
        window.alert('The alert has been successfully deleted.');
      }),
      map(() => alertActions.DeleteAlertSuccess({ alertId: action.alertId })),
      catchError((error) => of(generalActions.SetErrorMessage({ error })))
    ))
  ));

  constructor(
    private actions$: Actions,
    private alertService: AlertService
  ) {}
}