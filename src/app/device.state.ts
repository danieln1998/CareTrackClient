import { Device } from "./models/device";

export interface DeviceState {
  readonly devices: Device[];
  readonly selectedDevice: Device | null;
  readonly hasMoreDevices: boolean;
}