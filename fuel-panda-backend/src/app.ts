import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import hubRoutes from "./routes/admin/hub";
import terminalRutes from "./routes/admin/terminal";
import vehicleRoutes from "./routes/admin/vehicle";
import productRoutes from "./routes/admin/product";
import driverRoutes from "./routes/admin/driver";
import orderRoutes from "./routes/non-admin/order";
import vehicleAllocationRoutes from "./routes/admin/vehicleAllocation";
import shiftRoutes from "./routes/non-admin/shift";
import gpsRoutes from './routes/non-admin/gps'
import deliveryStatusRoutes from './routes/non-admin/deliveryStatus'

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/hubs", hubRoutes);
app.use("/api/terminals", terminalRutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/products", productRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/vehicle-allocation", vehicleAllocationRoutes);
app.use("/api/shifts", shiftRoutes);
app.use('/api/gps', gpsRoutes)
app.use('/api/delivery-status', deliveryStatusRoutes)

app.get("/", (req, res) => {
  res.send("Fleet Tracking Backend Running 🚚");
});

export default app;
