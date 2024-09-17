import { createAction, props } from "@ngrx/store";
import { Room } from "../models/room";

export const AddRoom = createAction('[Room] Add Room', props<Room>());
export const AddRoomSuccess = createAction('[Room] Added Room successfully', props<Room>());

export const UpdateRoom = createAction('[Room] Update Room', props<{id: string, room: Room}>());
export const UpdateRoomSuccess = createAction('[Room] Updated Room successfully', props<Room>());

export const GetRoom = createAction('Get Room', props<{roomId: string}>());
export const GetRoomSuccess = createAction('[Room] Get Room successfully', props<{ room: Room }>());

export const GetRooms = createAction('Get Rooms', props<{pageNumber: number, pageSize: number}>());
export const GetRoomsSuccess = createAction('[Room] Get Rooms successfully', props<{rooms: Room[], hasMoreRooms: boolean}>());

export const DeleteRoom = createAction('Delete Room', props<{roomId: string}>());
export const DeleteRoomSuccess = createAction('Delete Room successfully', props<{roomId: string}>());