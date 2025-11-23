import { Types } from "mongoose";

export interface SendGpsDTO {
  driverId: Types.ObjectId | string;
  shiftId?: Types.ObjectId | string;
  allocationId?: Types.ObjectId | string;
  vehicleId?: Types.ObjectId | string;
  lat: number;
  lng: number;
  ts?: string | number;
}

export interface FleetActiveFilters {
  date?: string;
}

export interface VehicleHistoryFilters {
  from?: string; 
  to?: string;
  shiftId?: string;
  limit?: number;
  page?: number;
}
