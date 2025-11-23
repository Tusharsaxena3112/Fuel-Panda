import { Request, Response } from "express";
import * as ProductService from "../services/product";
import {
  CreateProductDTO,
  UpdateProductDTO,
  ProductFilters,
} from "../types/product";

export const createProduct = async (
  req: Request<{}, {}, CreateProductDTO>,
  res: Response
) => {
  try {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getProducts = async (
  req: Request<{}, {}, {}, ProductFilters>,
  res: Response
) => {
  try {
    const products = await ProductService.getProducts(req.query);
    res.json(products);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getProductById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateProduct = async (
  req: Request<{ id: string }, {}, UpdateProductDTO>,
  res: Response
) => {
  try {
    const product = await ProductService.updateProduct(
      req.params.id,
      req.body
    );
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    await ProductService.deleteProduct(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
