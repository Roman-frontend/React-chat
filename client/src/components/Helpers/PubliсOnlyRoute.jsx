import React, { useEffect, useLayoutEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../../hooks/auth.hook.js';

export const PubliсOnlyRoute = ({ component: Component, ...rest }) => {
  const token = useSelector((state) => state.token);
  const userData = useSelector((state) => state.userData);
  const { login } = useAuth();
  const storageData = localStorage.getItem('userData');

  if (token && userData && !storageData) login(userData, token);

  function assignRouteToApply(routeProps) {
    if (!token) {
      return <Component {...routeProps} />;
    } else {
      return <Redirect to='/chat' />;
    }
  }

  return <Route {...rest} render={assignRouteToApply} />;
};
