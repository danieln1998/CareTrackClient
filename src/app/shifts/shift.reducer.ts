import { createReducer, on } from "@ngrx/store";
import * as shiftActions from './shift.actions'
import { ShiftState } from "../shift.state";


export const initialState: ShiftState = {

    shift: [],
    selectedShift: null,
    shiftAssignments: [],
    hasMoreShifts: true,
    employeeShift: null,
    employeeShifts: []

}

export const ShiftReducer = createReducer(
    initialState,
    on(shiftActions.AddShiftSuccess, (state, { shift }) => ({
        ...state,
        shift: [
            ...state.shift,
            shift
        ]
    })),

    on(shiftActions.UpdateShiftSuccess, (state, { shift }) => ({
        ...state,
        shift: state.shift.map(s => s.id === shift.id ? shift : s)
    })),

    on(shiftActions.GetShiftSuccess, (state, { shift }) => ({
        ...state,
        selectedShift: shift
    })),

    on(shiftActions.GetShiftsSuccess, (state, { shifts, pageSize  }) => ({
        ...state,
        shift: [...shifts],
        hasMoreShifts: shifts.length >= pageSize
    })),
    on(shiftActions.GetShiftAssignmentsSuccess, (state, { shiftAssignments }) => ({
        ...state,
        shiftAssignments: [...shiftAssignments]
      })),

      on(shiftActions.GetShiftsByEmployeeIdSuccess, (state, { shifts , pageSize }) => ({
        ...state,
        shift: [...shifts],
        hasMoreShifts: shifts.length >= pageSize
        
      })),

      on(shiftActions.DeleteShiftSuccess, (state, { shiftId }) => ({
        ...state,
        shift: state.shift.filter(s => s.id !== shiftId)
      })),

      on(shiftActions.GetEmployeeShiftByEmployeeIdSuccess, (state, { employeeShift }) => ({
        ...state,
        employeeShift: employeeShift
      })),  

      on(shiftActions.EnterShiftSuccess, (state, { employeeShift }) => ({
        ...state,
        employeeShift: employeeShift
      })),

      on(shiftActions.ExitShiftSuccess, (state, { employeeShift }) => ({
        ...state,
        employeeShift: employeeShift
      })),

      on(shiftActions.GetEmployeeShiftsByShiftIdSuccess, (state, { employeeShifts }) => ({
        ...state,
        employeeShifts: [...employeeShifts]
      }))

     
    

)