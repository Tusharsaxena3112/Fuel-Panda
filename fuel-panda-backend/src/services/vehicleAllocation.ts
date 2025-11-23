import VehicleAllocation, { IVehicleAllocation } from "../models/VehicleAllocation";
import {
  CreateAllocationDTO,
  UpdateAllocationDTO,
  AllocationFilters,
} from "../types/vehicleAllocation";

export const createAllocation = async (
  data: CreateAllocationDTO
): Promise<IVehicleAllocation> => {

  const existing = await VehicleAllocation.findOne({
    orders: { $in: data.orders },
    date: data.date,
  });
  if (existing) {
    throw new Error("One or more orders are already assigned to another allocation");
  }

  return await VehicleAllocation.create(data);
};


export const getAllocations = async (
  filters: AllocationFilters
): Promise<IVehicleAllocation[]> => {
  const { page = 1, limit = 20, date, driverId, vehicleId } = filters;

  const query: any = {};
  if (date) query.date = date;
  if (driverId) query.driverId = driverId;
  if (vehicleId) query.vehicleId = vehicleId;

  return VehicleAllocation.find(query)
    .populate("orders")
    .populate("driverId")
    .populate("vehicleId")
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });
};

export const getAllocationById = async (
  id: string
): Promise<IVehicleAllocation | null> => {
  return VehicleAllocation.findById(id)
    .populate("orders")
    .populate("driverId")
    .populate("vehicleId");
};

export const updateAllocation = async (
  id: string,
  data: UpdateAllocationDTO
): Promise<IVehicleAllocation | null> => {
  return VehicleAllocation.findByIdAndUpdate(id, data, {
    new: true,
  });
};

export const deleteAllocation = async (id: string): Promise<void> => {
  await VehicleAllocation.findByIdAndDelete(id);
};
