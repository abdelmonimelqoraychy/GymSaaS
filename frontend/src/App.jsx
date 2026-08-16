import { Navigate, Route, Routes } from "react-router";

import RoleRoute from "./components/RoleRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import ClientLayout from "./layouts/ClientLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Plans from "./pages/Plans";
import Subscriptions from "./pages/Subscriptions";
import Payments from "./pages/Payments";
import GymSettings from "./pages/GymSettings";

import ClientHome from "./pages/client/ClientHome";
import MySubscription from "./pages/client/MySubscription";
import MyPayments from "./pages/client/MyPayments";
import MyAttendances from "./pages/client/MyAttendances";
import MyQRCode from "./pages/client/MyQRCode";
import MyProfile from "./pages/client/MyProfile";

function App() {
  return (
    <Routes>
      {/* Site public */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Espace client */}
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

      {/* Espace administrateur existant */}
      <Route element={<RoleRoute allow="admin" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/gym" element={<GymSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
