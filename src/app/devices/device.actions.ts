import { createAction, props } from "@ngrx/store";
import { Device } from "../models/device";

export const AddDevice = createAction('[Device] Add Device', props<Device>());
export const AddDeviceSuccess = createAction('[Device] Added Device successfully', props<Device>());

export const UpdateDevice = createAction('[Device] Update Device', props<{id: string, device: Device}>());
export const UpdateDeviceSuccess = createAction('[Device] Updated Device successfully', props<Device>());

export const GetDevice = createAction('[Device] Get Device', props<{deviceId: string}>());
export const GetDeviceSuccess = createAction('[Device] Get Device successfully', props<{ device: Device }>());

export const GetDevices = createAction('[Device] Get Devices', props<{pageNumber: number, pageSize: number}>());
export const GetDevicesSuccess = createAction('[Device] Get Devices successfully', props<{devices: Device[], hasMoreDevices: boolean}>());

export const DeleteDevice = createAction('[Device] Delete Device', props<{deviceId: string}>());
export const DeleteDeviceSuccess = createAction('[Device] Delete Device successfully', props<{deviceId: string}>());

