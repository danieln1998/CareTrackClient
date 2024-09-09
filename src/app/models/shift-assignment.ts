import { Employee } from "./employee";
import { Shift } from "./shift";


export interface ShiftAssignment
 {

    id? : string,
    employee :  Employee,
    shift: Shift,
    status?: string
   

}