import { Navigate, Outlet, useLocation } from "react-router";

import { getStoredUser, getToken } from "../services/auth";
import { isAdmin, isMember } from "../services/roles";

function RoleRoute({ allow }) {
  const location = useLocation();
  const token = getToken();
  const user = getStoredUser();

  if (!token || !user) {
    return (
      <Navigate
        to={allow === "admin" ? "/admin-login" : "/login"}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  const allowed = allow === "admin" ? isAdmin(user) : isMember(user);

  if (!allowed) {
    return <Navigate to={isAdmin(user) ? "/dashboard" : "/client"} replace />;
  }

  return <Outlet />;
}

export default RoleRoute;
