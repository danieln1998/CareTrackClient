import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employees/employee-list/employee-list.component';
import { LoginComponent } from './authentication/login/login.component';
import { AuthGuard } from './authentication/auth.guard';
import { DashboardComponent } from './employees/dashboard/dashboard.component';
import { environment } from 'src/environments/environment';
import { RegisterUserFormComponent } from './employees/register-user-form/register-user-form.component';
import { EmployeeFormComponent } from './employees/employee-form/employee-form.component';
import { AccountSettingsComponent } from './employees/account-settings/account-settings.component';
import { ShiftFormComponent } from './shifts/shift-form/shift-form.component';
import { ShiftAssignmentFormComponent } from './shifts/shift-assignment-form/shift-assignment-form.component';
import { ShiftListComponent } from './shifts/shift-list/shift-list.component';
import { ShiftEmployeesComponent } from './shifts/shift-employees/shift-employees.component';
import { RoomListComponent } from './rooms/room-list/room-list.component';
import { RoomFormComponent } from './rooms/room-form/room-form.component';
import { PatientListComponent } from './patients/patient-list/patient-list.component';
import { PatientFormComponent } from './patients/patient-form/patient-form.component';
import { AlertListComponent } from './alerts/alert-list/alert-list.component';
import { DeviceFormComponent } from './devices/device-form/device-form.component';
import { DeviceListComponent } from './devices/device-list/device-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {path:"login",component:LoginComponent},
  {path:"employeeList",component:EmployeeListComponent,canActivate: [AuthGuard], data: { requiredRole: environment.superAdmin}},
  {path:"dashboard",component:DashboardComponent,canActivate: [AuthGuard],data: { requiredRole: environment.user}},
  {path:"registerUser",component:RegisterUserFormComponent,canActivate: [AuthGuard],data: { requiredRole: environment.superAdmin}},
  {path:"employeeEdit/:id",component:EmployeeFormComponent,canActivate: [AuthGuard],data: { requiredRole: environment.superAdmin}},
  {path:"employeeAdd/:userId",component:EmployeeFormComponent,canActivate: [AuthGuard],data: { requiredRole: environment.superAdmin}},
  {path:"updateUserRole/:userId",component:RegisterUserFormComponent,canActivate: [AuthGuard],data: { requiredRole: environment.superAdmin}},
  {path:"accountSettings",component:AccountSettingsComponent,canActivate: [AuthGuard],data: { requiredRole: environment.user}},
  {path:"shiftAdd",component:ShiftFormComponent,canActivate: [AuthGuard],data: { requiredRole: environment.admin}},
  {path:"shiftEdit/:id",component:ShiftFormComponent,canActivate: [AuthGuard],data: { requiredRole: environment.admin}},
  {path:"shiftAssignmentAdd/:shiftId",component:ShiftAssignmentFormComponent,canActivate: [AuthGuard],data: { requiredRole: environment.admin}},
  {path:"shiftList",component:ShiftListComponent,canActivate: [AuthGuard],data: { requiredRole: environment.admin}},
  {path:"shiftEmployees/:shiftId",component:ShiftEmployeesComponent,canActivate: [AuthGuard],data: { requiredRole: environment.admin}},
  {path:"shiftAssignmentEdit/:shiftId",component:ShiftAssignmentFormComponent,canActivate: [AuthGuard],data: { requiredRole: environment.admin}},
  {path:"shifts", component: ShiftListComponent, canActivate: [AuthGuard], data: { requiredRole: environment.user}},
  { path: "roomList", component: RoomListComponent, canActivate: [AuthGuard], data: { requiredRole: environment.user } },
  { path: "roomAdd", component: RoomFormComponent, canActivate: [AuthGuard], data: { requiredRole: environment.superAdmin } },
  { path: "roomEdit/:id", component: RoomFormComponent, canActivate: [AuthGuard], data: { requiredRole: environment.superAdmin } },
  { path: "patientList", component: PatientListComponent, canActivate: [AuthGuard], data: { requiredRole: environment.user } },
  { path: "patientList/:roomId", component: PatientListComponent, canActivate: [AuthGuard], data: { requiredRole: environment.user } },
  { path: "patientAdd", component: PatientFormComponent, canActivate: [AuthGuard], data: { requiredRole: environment.superAdmin } },
  { path: "patientEdit/:id", component: PatientFormComponent, canActivate: [AuthGuard], data: { requiredRole: environment.superAdmin } },
  { path: "alertList", component: AlertListComponent, canActivate: [AuthGuard], data: { requiredRole: environment.user } },
  { path: "alertList/:patientId", component: AlertListComponent, canActivate: [AuthGuard], data: { requiredRole: environment.user } },
  { path: "deviceList", component: DeviceListComponent, canActivate: [AuthGuard], data: { requiredRole: environment.superAdmin } },
  { path: "deviceAdd", component: DeviceFormComponent, canActivate: [AuthGuard], data: { requiredRole: environment.superAdmin } },
  { path: "deviceEdit/:id", component: DeviceFormComponent, canActivate: [AuthGuard], data: { requiredRole: environment.superAdmin } }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
