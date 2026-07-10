import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function RequireAuth({ children }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    // Save where they were trying to go so we can redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
