import { Component, OnInit } from '@angular/core';
import { FeatureService } from 'src/app/feature.service';
import { select, Store } from '@ngrx/store';
import { AppState } from './app.state';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { AlertPollingService } from './alerts/alert-polling.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  role: string = '';
  features$ = new BehaviorSubject<string[]>([]);
  isLoginRoute$: Observable<boolean>;

  constructor(private featureService: FeatureService,private store: Store<AppState>,private alertPollingService: AlertPollingService){
    (window as any).store = this.store;
    this.isLoginRoute$ = this.store.pipe(select(state => state.authentication.isLoginRoute));
    
  }

  ngOnInit() {

    setTimeout(() => {
    
    this.isLoginRoute$.pipe(
      filter(isLoginRoute => isLoginRoute === false || isLoginRoute === true)
    ).subscribe(isLoginRoute => {
      if (isLoginRoute === false) {
        
        if (this.features$.getValue().length == 0) {
          setTimeout(() => {
            this.features$.next(["Dashboard"])
            this.getFeatures();
          })
          
        }
      } else {
        if (this.features$.getValue().length > 0) {
          setTimeout(() => {
            this.features$.next([])
          })
        }
        

      }
    })

  })

  this.alertPollingService.startPolling();
  
  }



  getFeatures(){
    this.role = this.featureService.getRole();
    this.featureService.getFeatures(this.role).subscribe(newFeatures => {
      const currentFeatures = this.features$.getValue()
      this.features$.next([...currentFeatures, ...newFeatures])
    });
    
  }


  navigateToFeature(feature: string): void {
    this.featureService.navigateToFeature(feature);
  }


}
