export interface CreateVehicleDTO {
  plateNumber: string;
  vehicleModel: string;
  capacityGallons: number;
  isActive?: boolean;
}

export interface UpdateVehicleDTO {
  plateNumber?: string;
  vehicleModel?: string;
  capacityGallons?: number;
  isActive?: boolean;
}

export interface VehicleFilters {
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
