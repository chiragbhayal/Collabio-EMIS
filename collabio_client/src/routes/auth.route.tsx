import useAuth from "@/hooks/api/use-auth";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoute = () => {
  const { data: authData } = useAuth();
  const user = authData?.user;

  if (!user) return <Outlet />;

  const redirectPath = user.currentWorkspace?._id 
    ? `/workspace/${user.currentWorkspace._id}` 
    : "/home";
  
  return <Navigate to={redirectPath} replace />;
};

export default AuthRoute;
