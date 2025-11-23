import Vehicle, { IVehicle } from "../models/Vehicle";
import {
  CreateVehicleDTO,
  UpdateVehicleDTO,
  VehicleFilters,
} from "../types/vehicle";

export const createVehicle = async (
  data: CreateVehicleDTO
): Promise<IVehicle> => {
  return await Vehicle.create(data);
};

export const getVehicles = async (
  filters: VehicleFilters
): Promise<IVehicle[]> => {
  const { page = 1, limit = 20, isActive, search } = filters;

  const query: any = {};
  if (isActive) query.isActive = isActive;
  if (search)
    query.vehicleNumber = { $regex: search, $options: "i" };

  return Vehicle.find(query)
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });
};

export const getVehicleById = async (
  id: string
): Promise<IVehicle | null> => {
  return Vehicle.findById(id);
};

export const updateVehicle = async (
  id: string,
  data: UpdateVehicleDTO
): Promise<IVehicle | null> => {
  return Vehicle.findByIdAndUpdate(id, data, { new: true });
};

export const deleteVehicle = async (id: string): Promise<void> => {
  await Vehicle.findByIdAndDelete(id);
};
