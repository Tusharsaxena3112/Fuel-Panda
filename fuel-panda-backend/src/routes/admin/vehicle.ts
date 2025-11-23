import { Router } from "express";
import * as VehicleController from "../../controllers/vehicle";
import { authAdminStub } from "../../middlewares/authAdminStub";

const router = Router();

router.post("/", authAdminStub, VehicleController.createVehicle);
router.get("/", authAdminStub, VehicleController.getVehicles);
router.get("/:id", authAdminStub, VehicleController.getVehicleById);
router.put("/:id", authAdminStub, VehicleController.updateVehicle);
router.delete("/:id", authAdminStub, VehicleController.deleteVehicle);

export default router;
