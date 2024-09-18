import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { BehaviorSubject, Observable, map, takeUntil } from 'rxjs';
import { Patient } from 'src/app/models/patient';
import * as patientActions from '../patient.actions';
import { AppState } from 'src/app/app.state';
import * as generalActions from '../../general.actions';
import { AuthenticationService } from '../../authentication/authentication.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import * as roomActions from '../../rooms/room.actions';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})

export class PatientListComponent implements OnInit, OnDestroy {
  patients$: Observable<Patient[]>;
  displayedColumns: string[] = ['name', 'identificationNumber', 'roomNumber', 'deviceNumber', 'actions'];
  errorMessage$: Observable<string>;
  pageNumber: number = 1;
  pageSize: number = 10;
  hasMorePatients$: Observable<boolean>;
  pageSizeOptions: number[] = [10, 50, 100];
  filteredPatients$: Observable<Patient[]>;
  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  isSuperAdmin: boolean = false;
  selectedRoomId: string | null = null;
  selectedRoomNumber: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.patients$ = this.store.pipe(select(state => state.patient.patients));
    this.errorMessage$ = this.store.pipe(select(state => state.general.errorMessage));
    this.hasMorePatients$ = this.store.pipe(select(state => state.patient.hasMorePatients));
    this.filteredPatients$ = this.patientsSubject.asObservable();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.selectedRoomId = params.get('roomId');
      this.updateDisplayedColumns();
      if (this.selectedRoomId) {
        this.store.dispatch(roomActions.GetRoom({ roomId: this.selectedRoomId }));
        this.store.pipe(select(state => state.room.selectedRoom)).subscribe(room => {
          if (room) {
            this.selectedRoomNumber = room.roomNumber;
          }
        });
      }
      this.getPatients();
    });
   
    this.patients$.subscribe(patients => {
      let filteredPatients = patients;
      if (this.selectedRoomId) {
        filteredPatients = patients.filter(patient => patient.room?.id === this.selectedRoomId);
      }
      const sortedPatients = [...filteredPatients].sort((a, b) => 
        (a.name ?? '').localeCompare(b.name ?? '')
      );
      this.patientsSubject.next(sortedPatients);
    });
    this.checkSuperAdminRole();
  }

  ngOnDestroy() {
    this.store.dispatch(generalActions.SetErrorMessage({error:''}));
  }

  private updateDisplayedColumns() {
    if (this.selectedRoomId) {
      this.displayedColumns = ['name', 'identificationNumber', 'deviceNumber', 'actions'];
    } 
  }

  getPatients() {
    this.store.dispatch(patientActions.GetPatients({
      pageNumber: this.pageNumber, 
      pageSize: this.pageSize,
      filterOn: this.selectedRoomId ? 'RoomId' : null,
      filterQuery: this.selectedRoomId || null
    }));
  }

  addPatient() {
    
    this.router.navigate(['/patientAdd']);
    
  }

  filterPatients(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredPatients$ = this.patientsSubject.pipe(
      map(patients => patients.filter(patient => 
        patient.name?.toLowerCase().includes(filterValue) ?? false
      ))
    );
  }

  changePageSize(newSize: number) {
    this.pageSize = newSize;
    this.pageNumber = 1;
    this.getPatients();
  }

  nextPage() {
    this.pageNumber++;
    this.getPatients();
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getPatients();
    }
  }

  deletePatient(patientId: string) {
    const isConfirmed = confirm('Are you sure you want to delete this patient?');
    if (isConfirmed) {
      this.store.dispatch(patientActions.DeletePatient({patientId}));
    }
  }

  checkSuperAdminRole() {
    this.authService.isAuthorized(environment.superAdmin).subscribe(
      isSuperAdmin => {
        this.isSuperAdmin = isSuperAdmin;
      }
    );
  }
}