import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as deviceActions from './device.actions';
import { DeviceService } from "./device.service";
import { mergeMap, map, catchError, of } from "rxjs";
import * as generalActions from '../general.actions';

@Injectable({
    providedIn: 'root'
  })
export class DeviceEffects {

  addDevice$ = createEffect(() => this.actions$.pipe(
    ofType(deviceActions.AddDevice),
    mergeMap((action) => this.deviceService.addDevice(action)
      .pipe(
        map(device => deviceActions.AddDeviceSuccess(device)),
        catchError((error) => of(generalActions.SetErrorMessage({error})))
      ))
  ));

  getDevices$ = createEffect(() => this.actions$.pipe(
    ofType(deviceActions.GetDevices),
    mergeMap((action) => this.deviceService.getDevices(action.pageNumber, action.pageSize)
      .pipe(
        map(devices => deviceActions.GetDevicesSuccess({ 
          devices, 
          hasMoreDevices: devices.length >= action.pageSize 
        })),
        catchError((error) => of(generalActions.SetErrorMessage({ error })))
      )
    )
  ));

  getDevice$ = createEffect(() => this.actions$.pipe(
    ofType(deviceActions.GetDevice),
    mergeMap((action) => this.deviceService.getDevice(action.deviceId).pipe(
      map(device => deviceActions.GetDeviceSuccess({device})),
      catchError((error) => of(generalActions.SetErrorMessage({ error })))
    ))
  ));

  updateDevice$ = createEffect(() => this.actions$.pipe(
    ofType(deviceActions.UpdateDevice),
    mergeMap((action) => this.deviceService.updateDevice(action.id, action.device).pipe(
      map(device => deviceActions.UpdateDeviceSuccess(device)),
      catchError((error) => of(generalActions.SetErrorMessage({ error })))
    ))
  ));

  deleteDevice$ = createEffect(() => this.actions$.pipe(
    ofType(deviceActions.DeleteDevice),
    mergeMap((action) => this.deviceService.deleteDevice(action.deviceId).pipe(
      map(() => deviceActions.DeleteDeviceSuccess({ deviceId: action.deviceId })),
      catchError((error) => of(generalActions.SetErrorMessage({ error })))
    ))
  ));

  constructor(
    private actions$: Actions,
    private deviceService: DeviceService
  ) {}
}