import { createReducer, on } from "@ngrx/store";
import * as employeeActions from './employee.actions'
import { EmployeeState } from "../employee.state";




export const initialState: EmployeeState = {
    employee: [],
    selectedEmployee: null,
    hasMoreEmployees: true,
    currentEmployeeId: null
};

export const EmployeeReducer = createReducer(
    initialState,
    
    on(employeeActions.AddEmployeeSuccess, (state, { id, name, identificationNumber, role, userId }) => ({
        ...state,
        employee: [
            ...state.employee,
            { id, name, identificationNumber, role, userId }
        ]
    })),

    on(employeeActions.GetEmployeesSuccess, (state, { employees, hasMoreEmployees }) => ({
        ...state,
        employee: [...employees],
        hasMoreEmployees
    })),

    on(employeeActions.UpdateEmployeeSuccess, (state, { id, name, identificationNumber, role, userId }) => ({
        ...state,
        employee: state.employee.map(employee => employee.id === id ? { ...employee, name, identificationNumber, role, userId } : employee)
    })),

    on(employeeActions.DeleteEmployeeSuccess, (state, { employeeId }) => ({
        ...state,
        employee: state.employee.filter(employee => employee.id !== employeeId)
    })),
    
    on(employeeActions.GetEmployeeSuccess, (state, {employee}) => ({
        ...state,
        selectedEmployee: employee
    })),

    on(employeeActions.GetUserSuccess, (state, { user }) => ({
        ...state,
        selectedEmployee: user
    })),

    on(employeeActions.GetEmployeeIdByUserIdSuccess, (state, { employeeId }) => ({
        ...state,
        currentEmployeeId: employeeId
    }))
    
)