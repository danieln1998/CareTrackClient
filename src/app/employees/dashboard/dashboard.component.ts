import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, Observable, of, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { FeatureService } from 'src/app/feature.service';
import * as authenticationActions from 'src/app/authentication/authentication.actions';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit,OnDestroy {

  role: string = '';
  features$: Observable<string[]> = of([]);
  isLoginRoute$: Observable<boolean>;
  private subscription: Subscription | null = null;

  constructor(private featureService: FeatureService, private store: Store<AppState>) {
    this.isLoginRoute$ = this.store.pipe(select(state => state.authentication.isLoginRoute));
    
  }

  ngOnInit(): void {
    this.subscription = this.isLoginRoute$.pipe(
      filter(isLoginRoute => isLoginRoute === true)
    ).subscribe(() => {
      this.store.dispatch(authenticationActions.LoginSuccess())
    });
  
    this.role = this.featureService.getRole();
    this.features$ = this.featureService.getFeatures(this.role);
  }

  ngOnDestroy() {
    
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }



  navigateToFeature(feature: string): void {
    this.featureService.navigateToFeature(feature);
  }

}
  

