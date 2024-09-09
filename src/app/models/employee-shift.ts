import { Employee } from "./employee";
import { Shift } from "./shift";


export interface EmployeeShift {
    id?: string;
    startTime?: string;
    endTime?: string;
    employee :  Employee,
    shift: Shift
}