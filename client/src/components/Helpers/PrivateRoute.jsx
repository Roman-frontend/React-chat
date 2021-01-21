import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { STORAGE_NAME } from '../../redux/types';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const sessionStorageData = JSON.parse(sessionStorage.getItem(STORAGE_NAME));

  function assignRouteToApply(routeProps) {
    if (sessionStorageData && sessionStorageData.token) {
      return <Component {...routeProps} />;
    } else {
      return <Redirect to='/signIn' />;
    }
  }

  return <Route {...rest} render={assignRouteToApply} />;
};
