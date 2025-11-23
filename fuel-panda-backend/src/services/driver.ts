import Driver, { IDriver } from "../models/Driver";
import {
  CreateDriverDTO,
  UpdateDriverDTO,
  DriverFilters,
} from "../types/driver";

export const createDriver = async (
  data: CreateDriverDTO
): Promise<IDriver> => {
  return await Driver.create(data);
};

export const getDrivers = async (
  filters: DriverFilters
): Promise<IDriver[]> => {
  const { page = 1, limit = 20, isActive, search } = filters;

  const query: any = {};
  if (isActive) query.isActive = isActive;
  if (search) query.name = { $regex: search, $options: "i" };

  return await Driver.find(query)
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });
};

export const getDriverById = async (
  id: string
): Promise<IDriver | null> => {
  return Driver.findById(id);
};

export const updateDriver = async (
  id: string,
  data: UpdateDriverDTO
): Promise<IDriver | null> => {
  return Driver.findByIdAndUpdate(id, data, { new: true });
};

export const deleteDriver = async (id: string): Promise<void> => {
  await Driver.findByIdAndDelete(id);
};
