import { createReducer, on } from "@ngrx/store";
import * as deviceActions from './device.actions';
import { DeviceState } from "../device.state";

export const initialState: DeviceState = {
  devices: [],
  selectedDevice: null,
  hasMoreDevices: true
};

export const DeviceReducer = createReducer(
  initialState,
  
  on(deviceActions.AddDeviceSuccess, (state, device) => ({
    ...state,
    devices: [...state.devices, device]
  })),

  on(deviceActions.GetDevicesSuccess, (state, { devices, hasMoreDevices }) => ({
    ...state,
    devices: [...devices],
    hasMoreDevices
  })),

  on(deviceActions.UpdateDeviceSuccess, (state, updatedDevice) => ({
    ...state,
    devices: state.devices.map(device => device.id === updatedDevice.id ? updatedDevice : device),
    selectedDevice: updatedDevice
  })),

  on(deviceActions.DeleteDeviceSuccess, (state, { deviceId }) => ({
    ...state,
    devices: state.devices.filter(device => device.id !== deviceId),
    selectedDevice: state.selectedDevice?.id === deviceId ? null : state.selectedDevice
  })),
  
  on(deviceActions.GetDeviceSuccess, (state, { device }) => ({
    ...state,
    selectedDevice: device
  }))

  
);