import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Device } from 'src/app/models/device';
import * as deviceActions from '../device.actions';
import { AppState } from 'src/app/app.state';
import * as generalActions from '../../general.actions';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit, OnDestroy {
  devices$: Observable<Device[]>;
  displayedColumns: string[] = ['deviceNumber', 'actions'];
  errorMessage$: Observable<string>;
  pageNumber: number = 1;
  pageSize: number = 10;
  hasMoreDevices$: Observable<boolean>;
  pageSizeOptions: number[] = [10, 50, 100];
  filteredDevices$: Observable<Device[]>;
  private devicesSubject = new BehaviorSubject<Device[]>([]);

  constructor(private store: Store<AppState>) {
    this.devices$ = this.store.pipe(select(state => state.device.devices));
    this.errorMessage$ = this.store.pipe(select(state => state.general.errorMessage));
    this.hasMoreDevices$ = this.store.pipe(select(state => state.device.hasMoreDevices));
    this.filteredDevices$ = this.devicesSubject.asObservable();
  }

  ngOnInit(): void {
    this.getDevices();
    this.devices$.subscribe(devices => {
      const sortedDevices = [...devices].sort((a, b) => a.deviceNumber - b.deviceNumber);
      this.devicesSubject.next(sortedDevices);
    });
  }

  ngOnDestroy() {
    this.store.dispatch(generalActions.SetErrorMessage({error:''}));
  }

  getDevices() {
    this.store.dispatch(deviceActions.GetDevices({pageNumber: this.pageNumber, pageSize: this.pageSize}));
  }

  filterDevices(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDevices$ = this.devicesSubject.pipe(
      map(devices => devices.filter(device => 
        device.deviceNumber.toString().includes(filterValue)
      ))
    );
  }

  changePageSize(newSize: number) {
    this.pageSize = newSize;
    this.pageNumber = 1;
    this.getDevices();
  }

  nextPage() {
    this.pageNumber++;
    this.getDevices();
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getDevices();
    }
  }

  deleteDevice(deviceId: string) {
    const isConfirmed = confirm('Are you sure you want to delete this device?');
    if (isConfirmed) {
      this.store.dispatch(deviceActions.DeleteDevice({deviceId}));
    }
  }
}