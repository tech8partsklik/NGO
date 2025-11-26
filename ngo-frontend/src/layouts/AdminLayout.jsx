import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="admin-wrapper">
      {/* <Sidebar /> */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
