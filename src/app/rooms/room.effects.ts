import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as roomActions from './room.actions';
import { RoomService } from "./room.service";
import { mergeMap, map, catchError, of, tap } from "rxjs";
import * as generalActions from '../general.actions';
import { Router } from "@angular/router";

@Injectable()
export class RoomEffects {

  addRoom$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.AddRoom),
    mergeMap((action) => this.roomService.addRoom(action)
      .pipe(
        tap(() => {
          this.router.navigate(['/roomList']);
          window.alert('The room has been successfully added');
        }),
        map(room => roomActions.AddRoomSuccess(room)),
        catchError((error) => of(generalActions.SetErrorMessage({error})))
      ))
  ));

  getRooms$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.GetRooms),
    mergeMap((action) => this.roomService.getRooms(action.pageNumber, action.pageSize)
      .pipe(
        map(rooms => roomActions.GetRoomsSuccess({ 
          rooms, 
          hasMoreRooms: rooms.length >= action.pageSize 
        })),
        catchError((error) => of(generalActions.SetErrorMessage({ error })))
      )
    )
  ));

  getRoom$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.GetRoom),
    mergeMap((action) => this.roomService.getRoom(action.roomId).pipe(
      map(room => roomActions.GetRoomSuccess({room})),
      catchError((error) => of(generalActions.SetErrorMessage({ error })))
    ))
  ));

  updateRoom$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.UpdateRoom),
    mergeMap((action) => this.roomService.updateRoom(action.id, action.room).pipe(
      tap(() => {
        this.router.navigate(['/roomList']);
        window.alert('The room has been updated successfully.');
      }),
      map(room => roomActions.UpdateRoomSuccess(room)),
      catchError((error) => of(generalActions.SetErrorMessage({ error })))
    ))
  ));

  deleteRoom$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.DeleteRoom),
    mergeMap((action) => this.roomService.deleteRoom(action.roomId).pipe(
      tap(() => {
        window.alert('The room has been deleted successfully.');
      }),
      map(() => roomActions.DeleteRoomSuccess({ roomId: action.roomId })),
      catchError((error) => of(generalActions.SetErrorMessage({ error })))
    ))
  ));

  constructor(
    private actions$: Actions,
    private roomService: RoomService,
    private router: Router
  ) {}
}