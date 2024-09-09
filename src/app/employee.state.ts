import { Authentication } from "./models/authentication";
import { Employee } from "./models/employee";

export interface EmployeeState {
    readonly employee: Employee[],
    readonly selectedEmployee: Employee | Authentication | null,
    readonly hasMoreEmployees: boolean,
    readonly currentEmployeeId: string | null
  }