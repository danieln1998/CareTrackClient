import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EmployeeReducer } from './employees/employee.reducer';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppState } from './app.state';
import { EmployeeListComponent } from './employees/employee-list/employee-list.component';
import { EffectsModule } from '@ngrx/effects';
import { EmployeeEffects } from './employees/employee.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './authentication/login/login.component';
import { AuthenticationReducer } from './authentication/authentication.reducer';
import { AuthenticationEffects } from './authentication/authentication.effects';
import {MatInputModule} from '@angular/material/input';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './employees/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { RegisterUserFormComponent } from './employees/register-user-form/register-user-form.component';
import { GeneralReducer } from './general.reducer';
import { EmployeeFormComponent } from './employees/employee-form/employee-form.component';
import { AccountSettingsComponent } from './employees/account-settings/account-settings.component';
import { ShiftFormComponent } from './shifts/shift-form/shift-form.component';
import { ShiftReducer } from './shifts/shift.reducer';
import { ShiftEffects } from './shifts/shift.effects';
import { ShiftAssignmentFormComponent } from './shifts/shift-assignment-form/shift-assignment-form.component';
import { ShiftListComponent } from './shifts/shift-list/shift-list.component';
import { ShiftEmployeesComponent } from './shifts/shift-employees/shift-employees.component';
import { RoomListComponent } from './rooms/room-list/room-list.component';
import { RoomFormComponent } from './rooms/room-form/room-form.component';
import { RoomReducer } from './rooms/room.reducer';
import { RoomEffects } from './rooms/room.effects';
import { PatientReducer } from './patients/patient.reducer';
import { PatientEffects } from './patients/patient.effects';
import { PatientListComponent } from './patients/patient-list/patient-list.component';
import { PatientFormComponent } from './patients/patient-form/patient-form.component';
import { DeviceReducer } from './devices/device.reducer';
import { DeviceEffects } from './devices/device.effects';
import { AlertReducer } from './alerts/alert.reducer';
import { AlertEffects } from './alerts/alert.effects';
import { AlertListComponent } from './alerts/alert-list/alert-list.component';



@NgModule({
  declarations: [
    AppComponent,
    EmployeeListComponent,
    LoginComponent,
    DashboardComponent,
    RegisterUserFormComponent,
    EmployeeFormComponent,
    AccountSettingsComponent,
    ShiftFormComponent,
    ShiftAssignmentFormComponent,
    ShiftListComponent,
    ShiftEmployeesComponent,
    RoomListComponent,
    RoomFormComponent,
    PatientListComponent,
    PatientFormComponent,
    AlertListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot<AppState>({employee: EmployeeReducer, authentication: AuthenticationReducer,
      general:GeneralReducer,shift:ShiftReducer,room:RoomReducer,patient: PatientReducer,device: DeviceReducer,alert:AlertReducer}),
    EffectsModule.forRoot([EmployeeEffects,AuthenticationEffects,ShiftEffects,RoomEffects,PatientEffects,DeviceEffects,AlertEffects]),
    StoreDevtoolsModule.instrument(),
    BrowserAnimationsModule,
    MatTableModule,
    HttpClientModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatListModule
    
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
