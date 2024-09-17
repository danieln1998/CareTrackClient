import { createReducer, on } from "@ngrx/store";
import * as roomActions from './room.actions';
import { RoomState } from "../room.state";

export const initialState: RoomState = {
  rooms: [],
  selectedRoom: null,
  hasMoreRooms: true
};

export const RoomReducer = createReducer(
  initialState,
  
  on(roomActions.AddRoomSuccess, (state, room) => ({
    ...state,
    rooms: [...state.rooms, room]
  })),

  on(roomActions.GetRoomsSuccess, (state, { rooms, hasMoreRooms }) => ({
    ...state,
    rooms: [...rooms],
    hasMoreRooms
  })),

  on(roomActions.UpdateRoomSuccess, (state, updatedRoom) => ({
    ...state,
    rooms: state.rooms.map(room => room.id === updatedRoom.id ? updatedRoom : room)
  })),

  on(roomActions.DeleteRoomSuccess, (state, { roomId }) => ({
    ...state,
    rooms: state.rooms.filter(room => room.id !== roomId)
  })),
  
  on(roomActions.GetRoomSuccess, (state, { room }) => ({
    ...state,
    selectedRoom: room
  }))
);