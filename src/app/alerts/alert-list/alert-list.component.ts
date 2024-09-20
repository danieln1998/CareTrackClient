import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Alert } from 'src/app/models/alert';
import * as alertActions from '../alert.actions';
import { AppState } from 'src/app/app.state';
import * as generalActions from 'src/app/general.actions';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.css']
})
export class AlertListComponent implements OnInit, OnDestroy {
  alerts$: Observable<Alert[]>;
  filteredAlerts$: Observable<Alert[]>;
  errorMessage$: Observable<string>;
  pageNumber: number = 1;
  pageSize: number = 10;
  hasMoreAlerts$: Observable<boolean>;
  pageSizeOptions: number[] = [10, 50, 100];
  selectedDate: string | null = null;
  patientNameFilter: string = '';
  patientId: string | null = null;
  sortBy: string = 'Date';
  isAscending: boolean = false;
  displayedColumns: string[] = ['name', 'time', 'patientName', 'roomNumber', 'deviceNumber', 'actions'];

  private destroy$ = new Subject<void>();
  private alertsSubject = new BehaviorSubject<Alert[]>([]);

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {
    this.alerts$ = this.store.pipe(select(state => state.alert.alerts));
    this.errorMessage$ = this.store.pipe(select(state => state.general.errorMessage));
    this.hasMoreAlerts$ = this.store.pipe(select(state => state.alert.hasMoreAlerts));
    this.filteredAlerts$ = this.alertsSubject.asObservable();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.patientId = params['patientId'];
      this.getAlerts();
    });

    this.alerts$.subscribe(alerts => {
      this.alertsSubject.next(alerts);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(generalActions.SetErrorMessage({error:''}));
  }

  filterAlerts(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters(filterValue, this.selectedDate);
  }

  getAlerts() {
    this.store.dispatch(alertActions.GetAlerts({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      filterOn: this.patientId ? 'PatientId' : this.selectedDate ? 'Date' : this.patientNameFilter ? 'PatientName' : undefined,
      filterQuery: this.patientId || this.selectedDate || this.patientNameFilter || undefined,
      sortBy: this.sortBy,
      isAscending: this.isAscending
    }));
  }

  changePageSize(newSize: number) {
    this.pageSize = newSize;
    this.pageNumber = 1;
    this.getAlerts();
  }

  nextPage() {
    this.pageNumber++;
    this.getAlerts();
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getAlerts();
    }
  }

  onDateInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedDate = target.value;
    this.applyFilters(this.patientNameFilter, this.selectedDate);
  }


  clearDateFilter() {
    this.selectedDate = null;
    this.applyFilters(this.patientNameFilter, null);
  }

  private applyFilters(nameFilter: string, dateFilter: string | null) {
    this.filteredAlerts$ = this.alertsSubject.pipe(
      map(alerts => alerts.filter(alert => {
        const nameMatch = alert.patient.name?.toLowerCase().includes(nameFilter) ?? false;
        let dateMatch = true;
        if (dateFilter) {
          const alertDate = new Date(alert.time);
          const filterDate = new Date(dateFilter);
          dateMatch = alertDate.toDateString() === filterDate.toDateString();
        }
        return nameMatch && dateMatch;
      }))
    );
  }

  deleteAlert(alertId: string) {
    const isConfirmed = confirm('Are you sure you want to delete this alert?');
    if (isConfirmed) {
      this.store.dispatch(alertActions.DeleteAlert({ alertId }));
    }
  }

  toggleSortOrder() {
    this.isAscending = !this.isAscending;
    this.sortBy = 'Date';
    this.getAlerts();
  }


  formatDisplayDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
      
    });
  }
}