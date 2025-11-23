export interface CreateDriverDTO {
  name: string;
  phone: string;
  licenseNumber: string;
  isActive?: boolean
}

export interface UpdateDriverDTO {
  name?: string;
  phone?: string;
  licenseNumber?: string;
  isActive?: boolean
}

export interface DriverFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
}
