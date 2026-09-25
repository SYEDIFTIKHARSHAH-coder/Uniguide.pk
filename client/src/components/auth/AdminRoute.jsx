import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { SINGLE_ADMIN_EMAIL } from "../../config/constants";

/**
 * AdminRoute — Guards admin-only routes.
 * Enforces SINGLE ADMIN system:
 * 1. If not logged in → redirect to /login
 * 2. If logged in but not admin → redirect to /unauthorized
 * 3. If admin but email doesn't match SINGLE_ADMIN_EMAIL → redirect to /unauthorized
 * 4. If authorized → render children
 */
export default function AdminRoute({ children }) {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has admin role
  if (userRole !== "admin" && userRole !== "super_admin") { // Keeping super_admin for backwards compatibility with active tokens
    return <Navigate to="/unauthorized" replace />;
  }

  // Enforce SINGLE ADMIN — only the registered admin email can access
  if (user.email !== SINGLE_ADMIN_EMAIL) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
