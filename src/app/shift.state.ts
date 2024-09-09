import { EmployeeShift } from "./models/employee-shift";
import { Shift } from "./models/shift"
import { ShiftAssignment } from "./models/shift-assignment";




export interface ShiftState {
    readonly shift: Shift[],
    readonly selectedShift: Shift | null,
    readonly shiftAssignments: ShiftAssignment[],
    readonly hasMoreShifts: boolean,
    readonly employeeShift: EmployeeShift | null,
    readonly employeeShifts: EmployeeShift[]

  }