import GpsLocation, { IGpsLocation } from "../models/GpsLocation";
import Shift from "../models/Shift";
import { SendGpsDTO, VehicleHistoryFilters, FleetActiveFilters } from "../types/gps";
import { Types } from "mongoose";

function toDate(value?: string | number): Date {
  if (!value) return new Date();
  if (typeof value === "number") return new Date(value);
  return new Date(value);
}

export const storeGps = async (dto: SendGpsDTO): Promise<IGpsLocation> => {
  const { driverId, shiftId, allocationId, vehicleId, lat, lng, ts } = dto;

  let shift = null as any;
  if (shiftId) {
    shift = await Shift.findOne({ _id: shiftId, driverId, active: true });
    if (!shift) throw new Error("Shift not found or not active for the provided shiftId");
  } else {

    shift = await Shift.findOne({ driverId, active: true });
    if (!shift) throw new Error("No active shift found for driver");
  }

  const allocId = allocationId || shift.allocationId;
  const vehicle = vehicleId || shift.vehicleId;

  if (!allocId) throw new Error("Allocation ID missing (cannot derive allocation from shift)");
  if (!vehicle) throw new Error("Vehicle ID missing (cannot derive vehicle from shift)");

  const record = await GpsLocation.create({
    driverId: new Types.ObjectId(driverId),
    vehicleId: new Types.ObjectId(vehicle),
    allocationId: new Types.ObjectId(allocId),
    shiftId: shift._id,
    lat,
    lng,
    ts: toDate(ts),
  });

  return record;
};

export const getVehicleHistory = async (
  vehicleId: string,
  filters?: VehicleHistoryFilters
): Promise<IGpsLocation[]> => {
  const { from, to, shiftId, limit = 100, page = 1 } = filters || ({} as VehicleHistoryFilters);

  const query: any = { vehicleId };

  if (shiftId) query.shiftId = shiftId;
  if (from || to) query.ts = {};
  if (from) query.ts.$gte = new Date(from);
  if (to) query.ts.$lte = new Date(to);

  return GpsLocation.find(query)
    .sort({ ts: 1 })
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .lean();
};

export const getLiveTracking = async () => {
  const activeShifts = await Shift.find({ active: true })
    .populate("vehicleId")
    .populate("driverId");

  const result = [];

  for (const shift of activeShifts) {
    const vehicleId = shift.vehicleId._id;

    const gps = await GpsLocation.find({ vehicleId, shiftId: shift._id })
      .sort({ createdAt: 1 });

    if (gps.length === 0) continue;

    result.push({
      vehicleId,
      plateNumber: shift.vehicleId,
      driverName: shift.driverId,
      points: gps.map((g) => ({ lat: g.lat, lng: g.lng })),
      lastPoint: {
        lat: gps[gps.length - 1].lat,
        lng: gps[gps.length - 1].lng,
      },
    });
  }

  return result;
};

export const getVehicleLastLocation = async (vehicleId: string) => {
  return GpsLocation.findOne({ vehicleId }).sort({ ts: -1 }).lean();
};
