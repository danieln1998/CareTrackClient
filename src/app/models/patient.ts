import { Room } from './room';
import { Device } from './device';

export interface Patient {
  id?: string;
  identificationNumber: string;
  name: string;
  room?: Room;
  device?: Device;
}