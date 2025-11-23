import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import DriverLayout from "./layout/DriverLayout";

import DashboardPage from "./pages/admin/dashboard";
import HubsPage from "./pages/admin/hub";
import TerminalPage from "./pages/admin/terminal";
import VehiclesPage from "./pages/admin/vehicle";
import ProductsPage from "./pages/admin/product";
import DriversPage from "./pages/admin/driver";
import OrdersPage from "./pages/admin/order";
import VehicleAllocationPage from "./pages/admin/vehicleAllocation";
import DriverLogin from "./pages/non-admin/login";
import DriverShiftPage from "./pages/non-admin/shift";
import AdminShiftsPage from "./pages/admin/shift";
import AdminLiveTrackingMap from "./pages/admin/liveTracking";

export default createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "hubs", element: <HubsPage /> },
      { path: "terminals", element: <TerminalPage /> },
      { path: "vehicles", element: <VehiclesPage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "drivers", element: <DriversPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "vehicle-allocations", element: <VehicleAllocationPage /> },
      { path: "shifts", element: <AdminShiftsPage /> },
      { path: "live-tracking", element: <AdminLiveTrackingMap /> },
    ],
  },

  {
    path: "/driver",
    element: <DriverLayout />,
    children: [
      { path: "login", element: <DriverLogin /> },
      { path: "shifts", element: <DriverShiftPage /> },
      { path: "orders", element: <div>Driver Orders</div> },
      { path: "gps", element: <div>Driver GPS</div> },
    ],
  },
]);
