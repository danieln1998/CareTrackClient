import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Room } from 'src/app/models/room';
import * as roomActions from '../room.actions';
import { AppState } from 'src/app/app.state';
import * as generalActions from '../../general.actions';
import { AuthenticationService } from '../../authentication/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit, OnDestroy {
  rooms$: Observable<Room[]>;
  displayedColumns: string[] = ['roomNumber', 'actions'];
  errorMessage$: Observable<string>;
  pageNumber: number = 1;
  pageSize: number = 10;
  hasMoreRooms$: Observable<boolean>;
  pageSizeOptions: number[] = [10, 50, 100];
  filteredRooms$: Observable<Room[]>;
  private roomsSubject = new BehaviorSubject<Room[]>([]);
  isSuperAdmin: boolean = false;

  constructor(
    private store: Store<AppState>,
    private authService: AuthenticationService
  ) {
    this.rooms$ = this.store.pipe(select(state => state.room.rooms));
    this.errorMessage$ = this.store.pipe(select(state => state.general.errorMessage));
    this.hasMoreRooms$ = this.store.pipe(select(state => state.room.hasMoreRooms));
    this.filteredRooms$ = this.roomsSubject.asObservable();
  }

  ngOnInit(): void {
    this.getRooms();
    this.rooms$.subscribe(rooms => {
      const sortedRooms = [...rooms].sort((a, b) => a.roomNumber - b.roomNumber);
      this.roomsSubject.next(sortedRooms);
    });
    this.checkSuperAdminRole();
  }

  ngOnDestroy() {
    this.store.dispatch(generalActions.SetErrorMessage({error:''}));
  }

  getRooms() {
    this.store.dispatch(roomActions.GetRooms({pageNumber: this.pageNumber, pageSize: this.pageSize}));
  }

  filterRooms(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredRooms$ = this.roomsSubject.pipe(
      map(rooms => rooms.filter(room => 
        room.roomNumber.toString().includes(filterValue)
      ))
    );
  }

  changePageSize(newSize: number) {
    this.pageSize = newSize;
    this.pageNumber = 1;
    this.getRooms();
  }

  nextPage() {
    this.pageNumber++;
    this.getRooms();
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getRooms();
    }
  }

  deleteRoom(roomId: string) {
    const isConfirmed = confirm('Are you sure you want to delete this room?');
    if (isConfirmed) {
      this.store.dispatch(roomActions.DeleteRoom({roomId}));
    }
  }

  checkSuperAdminRole() {
    this.authService.isAuthorized(environment.superAdmin).subscribe(
      isSuperAdmin => {
        this.isSuperAdmin = isSuperAdmin;
      }
    );
  }
}