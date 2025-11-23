import Order from "../models/Order";
import Shift from "../models/Shift";
import VehicleAllocation from "../models/VehicleAllocation";

export const createShift = async (payload: {
  allocationId: string;
  driverId: string;
  vehicleId?: string;
  date: string;
}) => {
  const alloc = await VehicleAllocation.findById(payload.allocationId);
  if (!alloc) throw new Error("Allocation not found");

  if (alloc.driverId.toString() !== payload.driverId) {
    throw new Error("Driver is not assigned to this allocation");
  }

  const vehicleId = payload.vehicleId || alloc.vehicleId;

  const shift = await Shift.create({
    allocationId: alloc._id,
    driverId: payload.driverId,
    vehicleId: vehicleId,
    date: payload.date,
    active: false,
  });

  return shift;
};

export const startShift = async (shiftId: string, driverId: string) => {
  const shift = await Shift.findOne({ _id: shiftId, driverId });
  if (!shift) throw new Error("Shift not found");

  if (shift.active) throw new Error("Shift already started");

  shift.active = true;
  await shift.save();

  const allocation = await VehicleAllocation.findById(shift.allocationId);
  if (!allocation) throw new Error("Allocation not found");

  await Order.updateMany(
    { _id: { $in: allocation.orders }, status: "PENDING" },
    { $set: { status: "IN_PROGRESS" } }
  );
  return shift;
};

export const endShift = async (shiftId: string, driverId: string) => {
  const shift = await Shift.findOne({ _id: shiftId, driverId, active: true });
  if (!shift) throw new Error("No active shift found");
  shift.active = false;
  shift.endedAt = new Date();
  await shift.save();
  return shift;
};

export const getAllShiftForDriver = async (driverId: string) => {
  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  return Shift.findOne({ driverId, date: today }).populate({
    path: "allocationId",
    populate: [{ path: "vehicleId" }, { path: "orders" }],
  });
};

export const getAllShifts = async () => {
  return Shift.find()
    .populate("allocationId")
    .populate("vehicleId")
    .populate("driverId");
};
