import { Routes, Route } from "react-router";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Plans from "./pages/Plans";
import Subscriptions from "./pages/Subscriptions";
import Payments from "./pages/Payments";
import GymSettings from "./pages/GymSettings";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/gym" element={<GymSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
