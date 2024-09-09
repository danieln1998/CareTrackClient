import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { tap} from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}
  

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {

    const requiredRole = route.data['requiredRole'];
    return this.authService.isAuthorized(requiredRole).pipe(
      tap(isAuthorized => {
        if (!isAuthorized) {
          this.router.navigate(['/login']); 
        }
      })
      
    );
  }
 

  }
