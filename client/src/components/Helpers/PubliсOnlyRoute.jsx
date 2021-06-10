import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { reactiveVarToken } from '../../GraphQLApp/reactiveVars';

export const PubliсOnlyRoute = ({ component: Component, ...rest }) => {
  const sessionStorageData = JSON.parse(sessionStorage.getItem('storageData'));
  const token = useReactiveVar(reactiveVarToken);

  function assignRouteToApply(routeProps) {
    if (!token && !sessionStorageData) {
      return <Component {...routeProps} />;
    } else {
      return <Redirect to='/chat' />;
    }
  }
  return <Route {...rest} render={assignRouteToApply} />;
};
