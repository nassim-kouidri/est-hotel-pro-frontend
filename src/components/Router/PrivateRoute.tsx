import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth";

type PrivateRouteProps = {
  children: React.ReactNode;
  requiredRole?: string;
};

const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (requiredRole && user.accountResponse.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
