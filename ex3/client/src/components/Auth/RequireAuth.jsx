import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "state/authSlice";
import React from "react";

const RequireAuth = ({ children }) => {
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;
