import { IOrderProduct } from "../models/Order";

export interface CreateOrderDTO {
  sourceType: "hub" | "terminal";
  sourceId: string;
  destinationType: "hub" | "terminal";
  destinationId: string;
  products: IOrderProduct[];
  assignedDriverId?: string;
}

export interface UpdateOrderDTO {
  sourceType: "hub" | "terminal";
  sourceId: string;
  destinationType?: "hub" | "terminal";
  destinationId?: string;
  products?: IOrderProduct[];
  assignedDriverId?: string;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
}

export interface OrderFilters {
  search?: string;
  driverId?: string;
  status?: string;
  page?: number;
  limit?: number;
}
