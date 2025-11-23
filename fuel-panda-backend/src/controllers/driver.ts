import { Request, Response } from "express";
import {
  CreateDriverDTO,
  UpdateDriverDTO,
  DriverFilters,
} from "../types/driver";
import * as DriverService from "../services/driver";

export const createDriver = async (
  req: Request<{}, {}, CreateDriverDTO>,
  res: Response
) => {
  try {
    const driver = await DriverService.createDriver(req.body);
    res.status(201).json(driver);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getDrivers = async (
  req: Request<{}, {}, {}, DriverFilters>,
  res: Response
) => {
  try {
    const drivers = await DriverService.getDrivers(req.query);
    res.json(drivers);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getDriverById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const driver = await DriverService.getDriverById(req.params.id);
    if (!driver) return res.status(404).json({ error: "Driver not found" });
    res.json(driver);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateDriver = async (
  req: Request<{ id: string }, {}, UpdateDriverDTO>,
  res: Response
) => {
  try {
    const driver = await DriverService.updateDriver(req.params.id, req.body);
    res.json(driver);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteDriver = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    await DriverService.deleteDriver(req.params.id);
    res.json({ message: "Driver deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
