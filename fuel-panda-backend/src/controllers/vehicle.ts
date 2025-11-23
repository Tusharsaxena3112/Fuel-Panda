import { Request, Response } from "express";
import * as VehicleService from "../services/vehicle";
import {
  CreateVehicleDTO,
  UpdateVehicleDTO,
  VehicleFilters,
} from "../types/vehicle";

export const createVehicle = async (
  req: Request<{}, {}, CreateVehicleDTO>,
  res: Response
) => {
  try {
    const vehicle = await VehicleService.createVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getVehicles = async (
  req: Request<{}, {}, {}, VehicleFilters>,
  res: Response
) => {
  try {
    const vehicles = await VehicleService.getVehicles(req.query);
    res.json(vehicles);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getVehicleById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const vehicle = await VehicleService.getVehicleById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.json(vehicle);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateVehicle = async (
  req: Request<{ id: string }, {}, UpdateVehicleDTO>,
  res: Response
) => {
  try {
    const vehicle = await VehicleService.updateVehicle(req.params.id, req.body);
    res.json(vehicle);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteVehicle = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    await VehicleService.deleteVehicle(req.params.id);
    res.json({ message: "Vehicle deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
