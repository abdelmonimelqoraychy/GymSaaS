import { Route, Routes } from "react-router";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Plans from "./pages/Plans";
import Subscriptions from "./pages/Subscriptions";
import Payments from "./pages/Payments";
import GymSettings from "./pages/GymSettings";

function App() {
  return (
    <Routes>
      {/* Partie publique */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Partie privée : connexion obligatoire */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/gym" element={<GymSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
