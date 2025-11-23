import { Outlet, NavLink } from "react-router-dom";

export default function DriverLayout() {
  return (
    <div className="p-4">
      <nav className="flex space-x-4 border-b pb-2 mb-4">
        <NavLink to='/dashboard'>Switch to admin</NavLink>
      </nav>

      <Outlet />
    </div>
  );
}
