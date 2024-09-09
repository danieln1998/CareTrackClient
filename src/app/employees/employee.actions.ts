import { createAction, props } from "@ngrx/store";
import { Employee } from "../models/employee";
import { Authentication } from "../models/authentication";


export const AddEmployee = createAction('[Employee] Add Employee', props<Employee>());
export const AddEmployeeSuccess = createAction('[Employee] Added Employee successfully',props<Employee>());

export const UpdateEmployee = createAction('[Employee] Update Employee', props<{id: string, employee: Employee}>());
export const UpdateEmployeeSuccess = createAction('[Employee] Updated Employee successfully',props<Employee>());


export const RegisterUser = createAction('[Authentication] Register User', props<Authentication>());

export const GetEmployee = createAction('Get Employee', props<{employeeId: string}>());
export const GetEmployeeSuccess = createAction('[Employee] Get Employee successfully', props<{ employee: Employee }>());

export const GetEmployees = createAction('Get Employees', props<{pageNumber: number, pageSize: number}>());
export const GetEmployeesSuccess = createAction('[Employee] Get Employees successfully', props<{employees: Employee[], hasMoreEmployees: boolean}>());

export const GetUser = createAction('Get User', props<{userId: string}>());
export const GetUserSuccess = createAction('[Authentication] Get User successfully', props<{ user: Authentication }>());

export const DeleteEmployee = createAction('Delete Employee', props<{employeeId: string}>());
export const DeleteEmployeeSuccess = createAction('Delete Employee successfully', props<{employeeId: string}>());

export const UpdateUserRole = createAction('Update User Role', props<{userId: string, roles: string[]}>());


export const DeleteUser = createAction('Delete User', props<{userId: string}>());

export const GetEmployeeIdByUserId = createAction('[Employee] Get Employee ID by User ID');
export const GetEmployeeIdByUserIdSuccess = createAction('[Employee] Get Employee ID by User ID Success', props<{ employeeId: string }>());
