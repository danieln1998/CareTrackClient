import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  superAdmin: string = environment.superAdmin;
  admin: string = environment.admin;
  user: string = environment.user;
  features$: Observable<string[]> = of(['Account Settings','My Shifts','Rooms','Patients','Alerts']);

  constructor(private authService: AuthenticationService,private router: Router){}


  getRole(){
    const role = this.authService.getRole();
    if (role){
      return role;
    }
  }

  getFeatures(role: string): Observable<string[]> {
    if (role === this.superAdmin) {
      return this.features$.pipe(map(features => [...features, 'Devices','Employee Management', 'Shift Management','Logout']));
    } else if (role === this.admin) {
      return this.features$.pipe(map(features => [...features, 'Shift Management','Logout']));
    } else if (role === this.user) {
      return this.features$.pipe(map(features => [...features,'Logout']));
    }
    return of([]);
  }

  getFeatureRoute(feature: string) {
    switch (feature) {
      case 'Employee Management':
        return '/employeeList';
      case 'Shift Management':
        return '/shiftList';
      case 'Dashboard':
        return '/dashboard';
      case 'My Shifts':
        return '/shifts';
      case 'Account Settings':
        return '/accountSettings';
      case 'Rooms':
        return '/roomList';
      case 'Patients':
        return '/patientList';
      case 'Alerts':
        return '/alertList';
      case 'Devices':
        return '/deviceList';
      default:
        return '/';
    }
  }

  navigateToFeature(feature: string): void {
    if (feature === 'Logout') {
      this.authService.logout();
      this.router.navigate(['/login']);
    } else {
      const route = this.getFeatureRoute(feature);
      this.router.navigate([route]);
    }
  }
}
