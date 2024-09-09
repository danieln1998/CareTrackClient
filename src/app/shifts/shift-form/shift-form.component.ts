import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Shift } from 'src/app/models/shift';
import { select, Store } from '@ngrx/store';
import * as shiftActions from '../shift.actions';
import { AppState } from 'src/app/app.state';
import { Observable } from 'rxjs';
import * as generalActions from '../../general.actions';

@Component({
  selector: 'app-shift-form',
  templateUrl: './shift-form.component.html',
  styleUrls: ['./shift-form.component.css']
})
export class ShiftFormComponent implements OnInit, OnDestroy {
  
  shiftForm: FormGroup = new FormGroup({});
  errorMessage$: Observable<string>;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>
  ) {
    this.errorMessage$ = this.store.pipe(select(state => state.general.errorMessage));
  }

  ngOnInit(): void {
    this.shiftForm = this.formBuilder.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(shiftActions.GetShift({shiftId: id}))
      this.store.pipe(select(state => state.shift.selectedShift)).subscribe(shift => {
        this.shiftForm.patchValue(shift as Shift)
      });
    }
  }

  ngOnDestroy() {
    this.store.dispatch(generalActions.SetErrorMessage({error:''}));
  }

  onSubmit() {
    if (this.shiftForm.valid) {
      const formValue = this.shiftForm.value;
      let startTime = formValue.startTime;
      let endTime = formValue.endTime;
      
      let id = this.activatedRoute.snapshot.paramMap.get('id');
      
      let shift: Shift = {
        startTime,
        endTime
      }

      if (id) {
        this.store.dispatch(shiftActions.UpdateShift({ shiftId: id, shift }));
      } else {
        this.store.dispatch(shiftActions.AddShift({shift}));
      }
    }
  }
}