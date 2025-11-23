import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-gray-100 p-4 space-y-4">
        <h1 className="text-xl font-bold">Admin</h1>

        <NavLink to='/driver/login'>Switch to driver</NavLink>

        <nav className="flex flex-col space-y-2">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/hubs">Hubs</NavLink>
          <NavLink to="/terminals">Terminals</NavLink>
          <NavLink to="/vehicles">Vehicles</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/drivers">Drivers</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          <NavLink to="/vehicle-allocations">Allocations</NavLink>
          <NavLink to="/shifts">Shifts</NavLink>
          <NavLink to="/live-tracking">Live Tracking</NavLink>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
