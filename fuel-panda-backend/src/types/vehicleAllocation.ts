import { Types } from "mongoose";

export interface CreateAllocationDTO {
  orders: Types.ObjectId[];
  driverId: Types.ObjectId;
  vehicleId: Types.ObjectId;
  date: string;
}

export interface UpdateAllocationDTO {
  vehicleId?: Types.ObjectId;
  driverId?: Types.ObjectId;
  date?: string;
}

export interface AllocationFilters {
  date?: string;
  vehicleId?: string;
  driverId?: string;
  page?: number;
  limit?: number;
}
