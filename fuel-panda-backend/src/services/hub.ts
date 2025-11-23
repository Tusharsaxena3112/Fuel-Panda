import Hub, { IHub } from "../models/Hub";
import {
  CreateHubDTO,
  UpdateHubDTO,
  HubFilters,
} from "../types/hub";

export const createHub = async (data: CreateHubDTO): Promise<IHub> => {
  return await Hub.create(data);
};

export const getHubs = async (filters: HubFilters): Promise<IHub[]> => {
  const { page = 1, limit = 20, search } = filters;

  const query: any = {};
  if (search) query.name = { $regex: search, $options: "i" };

  return Hub.find(query)
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });
};

export const getHubById = async (id: string): Promise<IHub | null> => {
  return Hub.findById(id);
};

export const updateHub = async (
  id: string,
  data: UpdateHubDTO
): Promise<IHub | null> => {
  return Hub.findByIdAndUpdate(id, data, { new: true });
};

export const deleteHub = async (id: string): Promise<void> => {
  await Hub.findByIdAndDelete(id);
};
