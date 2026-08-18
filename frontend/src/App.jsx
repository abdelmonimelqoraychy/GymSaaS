import { Route, Routes } from "react-router";

import RoleRoute from "./components/RoleRoute";
import ClientLayout from "./layouts/ClientLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import AdminLogin from "./pages/AdminLogin";
import Attendances from "./pages/Attendances";
import AuditLogs from "./pages/AuditLogs";
import Dashboard from "./pages/Dashboard";
import GymSettings from "./pages/GymSettings";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Members from "./pages/Members";
import NotFound from "./pages/NotFound";
import Payments from "./pages/Payments";
import Plans from "./pages/Plans";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
import Subscriptions from "./pages/Subscriptions";

import ClientHome from "./pages/client/ClientHome";
import MyAttendances from "./pages/client/MyAttendances";
import MyPayments from "./pages/client/MyPayments";
import MyProfile from "./pages/client/MyProfile";
import MyQRCode from "./pages/client/MyQRCode";
import MySubscription from "./pages/client/MySubscription";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      <Route element={<RoleRoute allow="member" />}>
        <Route element={<ClientLayout />}>
          <Route path="/client" element={<ClientHome />} />
          <Route path="/client/subscription" element={<MySubscription />} />
          <Route path="/client/payments" element={<MyPayments />} />
          <Route path="/client/attendances" element={<MyAttendances />} />
          <Route path="/client/qr-code" element={<MyQRCode />} />
          <Route path="/client/profile" element={<MyProfile />} />
        </Route>
      </Route>

      <Route element={<RoleRoute allow="admin" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/attendances" element={<Attendances />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/gym" element={<GymSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
