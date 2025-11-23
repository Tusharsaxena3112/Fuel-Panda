import Terminal, { ITerminal } from "../models/Terminal";
import {
  CreateTerminalDTO,
  UpdateTerminalDTO,
  TerminalFilters,
} from "../types/terminal";

export const createTerminal = async (data: CreateTerminalDTO): Promise<ITerminal> => {
  return await Terminal.create(data);
};

export const getTerminals = async (filters: TerminalFilters): Promise<ITerminal[]> => {
  const { page = 1, limit = 20, search } = filters;

  const query: any = {};
  if (search) query.name = { $regex: search, $options: "i" };

  return Terminal.find(query)
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });
};

export const getTerminalById = async (id: string): Promise<ITerminal | null> => {
  return Terminal.findById(id);
};

export const updateTerminal = async (
  id: string,
  data: UpdateTerminalDTO
): Promise<ITerminal | null> => {
  return Terminal.findByIdAndUpdate(id, data, { new: true });
};

export const deleteTerminal = async (id: string): Promise<void> => {
  await Terminal.findByIdAndDelete(id);
};
