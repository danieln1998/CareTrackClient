import { createAction, props } from "@ngrx/store";
import { Shift } from "../models/shift";
import { ShiftAssignment } from "../models/shift-assignment";
import { EmployeeShift } from "../models/employee-shift";


export const AddShift = createAction('[Shift] Add Shift', props<{ shift: Shift }>());
export const AddShiftSuccess = createAction('[Shift] Add Shift Success', props<{ shift: Shift }>());


export const GetShift = createAction('[Shift] Get Shift', props<{ shiftId: string }>());
export const GetShiftSuccess = createAction('[Shift] Get Shift Success', props<{ shift: Shift }>());

export const UpdateShift = createAction('[Shift] Update Shift', props<{ shiftId: string, shift: Shift }>());
export const UpdateShiftSuccess = createAction('[Shift] Update Shift Success', props<{ shift: Shift }>());

export const DeleteShift = createAction('[Shift] Delete Shift', props<{ shiftId: string }>());
export const DeleteShiftSuccess = createAction('[Shift] Delete Shift Success', props<{ shiftId: string }>());

export const AddShiftAssignment = createAction('[Shift Assignment] Add Shift Assignment', props<{ shiftAssignment: ShiftAssignment }>());

export const GetShifts = createAction('[Shift] Get Shifts', props<{ pageNumber: number, pageSize: number, sortBy: string, isAscending: boolean }>());
export const GetShiftsSuccess = createAction('[Shift] Get Shifts Success', props<{ shifts: Shift[], pageSize: number }>());


export const GetShiftAssignments = createAction('[Shift Assignment] Get Shift Assignments', props<{ shiftId: string }>());
export const GetShiftAssignmentsSuccess = createAction('[Shift Assignment] Get Shift Assignments Success', props<{ shiftAssignments: ShiftAssignment[] }>());


export const DeleteShiftAssignment = createAction('[Shift Assignment] Delete Shift Assignment', props<{ shiftAssignmentId: string }>());

export const GetShiftsByEmployeeId = createAction('[Shift] Get Shifts By Employee ID',props<{ employeeId: string, sortBy: string, isAscending: boolean, pageNumber: number, pageSize: number }>());
export const GetShiftsByEmployeeIdSuccess = createAction('[Shift] Get Shifts By Employee ID Success',props<{ shifts: Shift[] , pageSize: number}>());


export const EnterShift = createAction('[Employee Shift] Enter Shift', props<{ employeeId: string, shiftId: string }>());
export const EnterShiftSuccess = createAction('[Employee Shift] Enter Shift Success', props<{ employeeShift: EmployeeShift }>());

export const ExitShift = createAction('[Employee Shift] Exit Shift', props<{ employeeShiftId: string }>());
export const ExitShiftSuccess = createAction('[Employee Shift] Exit Shift Success', props<{ employeeShift: EmployeeShift }>());

export const GetEmployeeShiftByEmployeeId = createAction('[Employee Shift] Get Employee Shift By Employee ID',props<{ employeeId: string, shiftId: string }>());
export const GetEmployeeShiftByEmployeeIdSuccess = createAction('[Employee Shift] Get Employee Shift By Employee ID Success',props<{ employeeShift: EmployeeShift | null }>());


export const GetEmployeeShiftsByShiftId = createAction('[Employee Shift] Get Employee Shifts By Shift ID',props<{ shiftId: string }>());
export const GetEmployeeShiftsByShiftIdSuccess = createAction('[Employee Shift] Get Employee Shifts By Shift ID Success',props<{ employeeShifts: EmployeeShift[] }>());
  
    
    
  
 