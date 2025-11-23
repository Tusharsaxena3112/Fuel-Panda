export interface CreateProductDTO {
  name: string;
  unit: "gallons" | "liters";
}

export interface UpdateProductDTO {
  name?: string;
  unit?: "gallons" | "liters";
}

export interface ProductFilters {
  search?: string;
  page?: number;
  limit?: number;
}
