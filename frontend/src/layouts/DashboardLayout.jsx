import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function DashboardLayout() {
  return (
    <div>
      <Sidebar />

      <main style={{ marginLeft: 240 }}>
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
