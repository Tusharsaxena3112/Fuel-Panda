import { Router } from "express";
import * as DriverController from '../../controllers/driver';
import { authAdminStub } from "../../middlewares/authAdminStub";


const router = Router();

router.post("/", authAdminStub, DriverController.createDriver);
router.get("/", authAdminStub, DriverController.getDrivers);
router.get("/:id", authAdminStub, DriverController.getDriverById);
router.put("/:id", authAdminStub, DriverController.updateDriver);
router.delete("/:id", authAdminStub, DriverController.deleteDriver);

export default router;
