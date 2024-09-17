import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Room } from 'src/app/models/room';
import { select, Store } from '@ngrx/store';
import * as roomActions from '../room.actions';
import { AppState } from 'src/app/app.state';
import { Observable } from 'rxjs';
import * as generalActions from '../../general.actions';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.css']
})
export class RoomFormComponent implements OnInit, OnDestroy {
  
  roomForm: FormGroup = new FormGroup({});
  errorMessage$: Observable<string>;
  

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>
  ) {
    this.errorMessage$ = this.store.pipe(select(state => state.general.errorMessage));
  }

  ngOnInit(): void {
    this.roomForm = this.formBuilder.group({
      roomNumber: ['', [Validators.required, Validators.min(1)]]
    });
  
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(roomActions.GetRoom({roomId: id}));
      this.store.pipe(select(state => state.room.selectedRoom)).subscribe(room => {
        if (room) {
          this.roomForm.patchValue(room);
        }
      });
    }
  }

  ngOnDestroy() {
    this.store.dispatch(generalActions.SetErrorMessage({error:''}));
  }

  onSubmit() {
    if (this.roomForm.valid) {
      const formValue = this.roomForm.value;
      let roomNumber = formValue.roomNumber;
      
      let id = this.activatedRoute.snapshot.paramMap.get('id');
      
      let room: Room = {
        roomNumber
      };

      if (id) {
        this.store.dispatch(roomActions.UpdateRoom({ id, room }));
      } else {
        this.store.dispatch(roomActions.AddRoom(room));
      }
    }
  }
}