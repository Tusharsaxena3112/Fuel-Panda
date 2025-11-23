// src/types/index.ts
export interface BaseEntity {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

/* Entities */
export interface Hub extends BaseEntity {
  name: string;
  location: string;
  capacity?: number;
  isActive?: boolean;
}

export interface Terminal extends BaseEntity {
  name: string;
  location: string;
  capacity?: number;
  isActive?: boolean;
}

export interface Product extends BaseEntity {
  name: string;
  description?: string;
  unit: "gallons" | "liters";
}

export interface Driver extends BaseEntity {
  name: string;
  phone?: string;
  licenseNumber?: string;
  isActive?: boolean;
}

export interface Vehicle extends BaseEntity {
  vehicleNumber: string;
  model: string;
  capacity: number;
  status?: "available" | "unavailable";
}
