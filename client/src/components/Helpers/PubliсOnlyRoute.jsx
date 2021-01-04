import React, { useEffect, useLayoutEffect } from 'react';
import { STORAGE_NAME } from '../../redux/types';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../../hooks/auth.hook.js';

export const PubliсOnlyRoute = ({ component: Component, ...rest }) => {
  const token = useSelector((state) => state.token);
  const userData = useSelector((state) => state.userData);
  const { login } = useAuth();
  const sessionStorageData = JSON.parse(sessionStorage.getItem(STORAGE_NAME));
  const localStorageData = JSON.parse(localStorage.getItem(STORAGE_NAME));
  const storageData = sessionStorageData
    ? sessionStorageData
    : localStorageData
    ? localStorageData
    : null;

  function assignRouteToApply(routeProps) {
    if (!token) {
      return <Component {...routeProps} />;
    } else {
      return <Redirect to='/chat' />;
    }
  }

  return <Route {...rest} render={assignRouteToApply} />;
};
