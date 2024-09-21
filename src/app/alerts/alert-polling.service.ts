import { Injectable } from '@angular/core';
import { interval, Subscription, EMPTY } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { AlertService } from './alert.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import * as AlertActions from './alert.actions';
import { ToastrService } from 'ngx-toastr';
import { Alert } from '../models/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertPollingService {
  private pollingSubscription: Subscription | null = null;

  constructor(
    private alertService: AlertService,
    private store: Store<AppState>,
    private toastr: ToastrService
  ) {}

  startPolling() {
    if (this.pollingSubscription) {
      return; 
    }
  
    this.pollingSubscription = this.store.pipe(
      select(state => state.authentication.isLoginRoute),
      switchMap(isLoginRoute => {
        if (isLoginRoute) {
          return EMPTY;
        } else {
          return interval(10000).pipe(
            switchMap(() => this.alertService.checkForNewAlerts()),
            filter((alerts): alerts is Alert[] => alerts.length > 0)
          );
        }
      })
    ).subscribe(
      (newAlerts) => {
        newAlerts.forEach((alert, index) => {
          setTimeout(() => {
            this.store.dispatch(AlertActions.AddNewAlert({ alert }));
            this.showAlertToast(alert);
          }, index * 300); 
        });
      }
    );
  }
  
  private showAlertToast(alert: Alert) {
    const message = `
      <div class="alert-content">
        <strong>New Alert: ${alert.name}</strong><br>
        Time: ${new Date(alert.time).toLocaleTimeString()}<br>
        Patient: ${alert.patient.name}<br>
        Room: ${alert.patient.room?.roomNumber}
      </div>
    `;
  
    this.toastr.error(message, '', {
      timeOut: 0,
      extendedTimeOut: 0,
      closeButton: true,
      enableHtml: true,
      toastClass: 'alert-toast ngx-toastr',
      positionClass: 'toast-bottom-left',
      tapToDismiss: false
    });
  }

  stopPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }
}