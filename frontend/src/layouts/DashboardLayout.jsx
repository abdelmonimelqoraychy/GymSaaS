import { Outlet } from "react-router";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/dashboard-shell.css";

function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <Sidebar />

      <div className="dashboard-content">
        <Topbar />

        <main className="dashboard-outlet">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
