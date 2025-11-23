import { Types } from "mongoose";

export interface CreateShiftDTO {
  allocationId: Types.ObjectId | string;
  driverId: Types.ObjectId | string;
  vehicleId?: Types.ObjectId | string;
  date: string;
}

export interface UpdateShiftDTO {
  startedAt?: Date | string;
  endedAt?: Date | string;
  active?: boolean;
}

export interface ShiftFilters {
  driverId?: string;
  vehicleId?: string;
  allocationId?: string;
  date?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}
