import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Device } from 'src/app/models/device';
import { select, Store } from '@ngrx/store';
import * as deviceActions from '../device.actions';
import { AppState } from 'src/app/app.state';
import { Observable } from 'rxjs';
import * as generalActions from '../../general.actions';

@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.css']
})
export class DeviceFormComponent implements OnInit, OnDestroy {
  
  deviceForm: FormGroup = new FormGroup({});
  errorMessage$: Observable<string>;
  
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>
  ) {
    this.errorMessage$ = this.store.pipe(select(state => state.general.errorMessage));
  }

  ngOnInit(): void {
    this.deviceForm = this.formBuilder.group({
      deviceNumber: ['', [Validators.required, Validators.min(1)]]
    });
  
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(deviceActions.GetDevice({deviceId: id}));
      this.store.pipe(select(state => state.device.selectedDevice)).subscribe(device => {
        if (device) {
          this.deviceForm.patchValue(device);
        }
      });
    }
  }

  ngOnDestroy() {
    this.store.dispatch(generalActions.SetErrorMessage({error:''}));
  }

  onSubmit() {
    if (this.deviceForm.valid) {
      const formValue = this.deviceForm.value;
      let deviceNumber = formValue.deviceNumber;
      
      let id = this.activatedRoute.snapshot.paramMap.get('id');
      
      let device: Device = {
        deviceNumber
      };

      if (id) {
        this.store.dispatch(deviceActions.UpdateDevice({ id, device }));
      } else {
        this.store.dispatch(deviceActions.AddDevice(device));
      }
    }
  }
}