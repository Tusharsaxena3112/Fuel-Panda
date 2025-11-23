import Product, { IProduct } from "../models/Product";
import {
  CreateProductDTO,
  UpdateProductDTO,
  ProductFilters,
} from "../types/product";

export const createProduct = async (
  data: CreateProductDTO
): Promise<IProduct> => {
  return await Product.create(data);
};

export const getProducts = async (
  filters: ProductFilters
): Promise<IProduct[]> => {
  const { page = 1, limit = 20, search } = filters;

  const query: any = {};
  if (search) query.name = { $regex: search, $options: "i" };

  return Product.find(query)
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });
};

export const getProductById = async (
  id: string
): Promise<IProduct | null> => {
  return Product.findById(id);
};

export const updateProduct = async (
  id: string,
  data: UpdateProductDTO
): Promise<IProduct | null> => {
  return Product.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProduct = async (id: string): Promise<void> => {
  await Product.findByIdAndDelete(id);
};
