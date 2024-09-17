import { Room } from "./models/room";

export interface RoomState {
  readonly rooms: Room[];
  readonly selectedRoom: Room | null;
  readonly hasMoreRooms: boolean;
}