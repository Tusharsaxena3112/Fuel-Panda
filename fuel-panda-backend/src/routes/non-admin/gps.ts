import { Router } from "express";
import * as GpsController from "../../controllers/gps";

const router = Router();

router.post("/", GpsController.postGps);

router.get("/fleet/active", GpsController.getFleetActive);
router.get("/vehicle/:vehicleId/history", GpsController.getVehicleHistory);
router.get("/vehicle/:vehicleId/last", GpsController.getVehicleLast);

export default router;
