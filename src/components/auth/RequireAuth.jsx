import { Navigate, useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";

export default function RequireAuth({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("9jatax_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // token expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("9jatax_token");
      return <Navigate to="/login" replace />;
    }

    // logged in but no company yet
    if (!decoded.company_id && location.pathname !== "/settings/company") {
      return <Navigate to="/settings/company" replace />;
    }

    return children;
  } catch (err) {
    localStorage.removeItem("9jatax_token");
    return <Navigate to="/login" replace />;
  }
}