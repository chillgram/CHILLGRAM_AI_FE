import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function PrivateRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const bootstrapped = useAuthStore((s) => s.bootstrapped);

  // silent refresh가 끝나기 전에는 판단 보류
  if (!bootstrapped) return null;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}
