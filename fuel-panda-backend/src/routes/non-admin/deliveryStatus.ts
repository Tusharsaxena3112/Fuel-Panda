import { Router } from "express";
import { updateDeliveryHandler } from "../../controllers/deliveryStatus";

const router = Router();

router.post("/update", updateDeliveryHandler);

export default router;
