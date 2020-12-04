import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../hooks/auth.hook.js";

export const PubliсOnlyRoute = ({ component: Component, ...rest }) => {
  const token = useSelector((state) => state.token);
  const userData = useSelector((state) => state.userData);
  const { login } = useAuth();

  useEffect(() => {
    if (token) {
      console.log("login");
      login(userData, token);
    }
  }, [token]);

  function assignRouteToApply(routeProps) {
    if (!token) {
      return <Component {...routeProps} />;
    } else {
      return <Redirect to="/chat" />;
    }
  }

  return <Route {...rest} render={assignRouteToApply} />;
};
