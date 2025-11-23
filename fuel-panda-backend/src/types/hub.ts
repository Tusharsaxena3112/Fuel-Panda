import mongoose from "mongoose";

export interface CreateHubDTO {
  name: string;
  location: { lat: number; lng: number };
  inventory?: [{ producId: mongoose.Types.ObjectId; quantity: number }];
}

export interface UpdateHubDTO {
  name?: string;
  location?: { lat: number; lng: number };
  inventory?: [{ producId: string; quantity: number }];
}

export interface HubFilters {
  search?: string;
  page?: number;
  limit?: number;
}
