import { AuthState } from "./auth.state";
import { DeviceState } from "./device.state";
import { EmployeeState } from "./employee.state";
import { GeneralState } from "./general.state";
import { PatientState } from "./patient.state";
import { RoomState } from "./room.state";
import { ShiftState } from "./shift.state";


export interface AppState {
    readonly employee: EmployeeState,
    readonly authentication: AuthState
    readonly general: GeneralState,
    readonly shift: ShiftState,
    readonly room: RoomState,
    readonly patient: PatientState,
    readonly device: DeviceState
}
