import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Patient } from 'src/app/models/patient';
import { Room } from 'src/app/models/room';
import { Device } from 'src/app/models/device';
import * as patientActions from '../patient.actions';
import * as roomActions from '../../rooms/room.actions';
import * as deviceActions from '../../devices/device.actions';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute } from '@angular/router';
import * as generalActions from 'src/app/general.actions';


@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements OnInit, OnDestroy {
  patientForm: FormGroup;
  rooms$: Observable<Room[]>;
  availableDevices$: Observable<Device[]>;
  private subscriptions: Subscription[] = [];
  isEditMode = false;
  patientId: string | null = null;
  errorMessage$: Observable<string>;
  

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute
  ) {
    this.patientForm = this.initForm();
    this.rooms$ = this.store.pipe(select(state => state.room.rooms));
    this.availableDevices$ = this.store.pipe(select(state => state.device.devices));
    this.errorMessage$ = this.store.pipe(select(state => state.general.errorMessage));
  }

  ngOnInit() {
    this.store.dispatch(roomActions.GetRooms({ pageNumber: 1, pageSize: 1000 }));
    this.store.dispatch(deviceActions.GetDevices({ pageNumber: 1, pageSize: 1000 }));
    this.store.dispatch(patientActions.GetPatients({ pageNumber: 1, pageSize: 1000 }));

    this.rooms$ = this.store.pipe(select(state => state.room.rooms));
    this.availableDevices$ = this.store.pipe(
      select(state => {
        const occupiedDeviceNumbers = state.patient.patients
          .map(p => p.device?.deviceNumber)
          .filter(Boolean);
        return state.device.devices.filter(
          device => !occupiedDeviceNumbers.includes(device.deviceNumber) || 
                    (this.isEditMode && device.id === this.patientForm.get('deviceId')?.value)
        );
      })
    );

    this.patientId = this.route.snapshot.paramMap.get('id');
    if (this.patientId) {
      this.isEditMode = true;
      this.store.dispatch(patientActions.GetPatient({ patientId: this.patientId }));
      this.subscriptions.push(
        this.store.pipe(select(state => state.patient.selectedPatient))
          .subscribe(patient => {
            if (patient) {
              this.patientForm.patchValue({
                identificationNumber: patient.identificationNumber,
                name: patient.name,
                roomId: patient.room?.id,
                deviceId: patient.device?.id
              });
            }
          })
      );
    }
  }

  initForm(): FormGroup {
    return this.formBuilder.group({
      identificationNumber: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      roomId: ['', Validators.required],
      deviceId: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.patientForm.valid) {
      const formValue = this.patientForm.value;
      const patient: Patient = {
        identificationNumber: formValue.identificationNumber,
        name: formValue.name,
        room: { id: formValue.roomId, roomNumber: formValue.roomNumber },
        device: { id: formValue.deviceId, deviceNumber: formValue.deviceNumber }
      };

      if (this.isEditMode && this.patientId) {
        this.store.dispatch(patientActions.UpdatePatient({ id: this.patientId, patient }));
      } else {
        this.store.dispatch(patientActions.AddPatient(patient));
      }
    }
  }

  ngOnDestroy() {
    this.store.dispatch(generalActions.SetErrorMessage({ error: '' }));
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}