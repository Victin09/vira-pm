import React from "react";
import { RouteProps, Navigate, Outlet } from "react-router-dom";
import Loader from "../shared/Loader";
import { useMe } from "../../hooks/useMe";

interface Props extends RouteProps {
  excludedRoles?: string[];
}

const PrivateRoute: React.FC<Props> = ({ excludedRoles, ...rest }) => {
  const { data, isLoading } = useMe();
  console.log('dataMe', data)
  if (isLoading) {
    return <Loader />;
  }
  if (!data.success) {
    return <Navigate to="/auth/login" />
  }

  return (
    <Outlet />
    // <>
    //   <Route {...rest} />
    // </>
  );
};

export default PrivateRoute;
