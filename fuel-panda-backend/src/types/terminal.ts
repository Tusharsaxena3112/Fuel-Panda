import mongoose from "mongoose";

export interface CreateTerminalDTO {
  name: string;
  location: { lat: number; lng: number };
  inventory?: [{ producId: mongoose.Types.ObjectId; quantity: number }];
}

export interface UpdateTerminalDTO {
  name?: string;
  location?: { lat: number; lng: number };
  inventory?: [{ producId: string; quantity: number }];
}

export interface TerminalFilters {
  search?: string;
  page?: number;
  limit?: number;
}
