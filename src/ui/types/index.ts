export interface TimeZone {
  city: string;
  timezone: string;
  offset: string;
}

export type RoomStatus = 'available' | 'occupied' | 'reserved-soon';