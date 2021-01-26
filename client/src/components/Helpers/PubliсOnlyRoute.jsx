import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { reactiveVarToken } from '../../GraphQLApp/reactiveVariables';

export const PubliсOnlyRoute = ({ component: Component, ...rest }) => {
  console.log({ component: Component, ...rest });
  const sessionStorageData = JSON.parse(sessionStorage.getItem('storageData'));
  const token = useReactiveVar(reactiveVarToken);

  function assignRouteToApply(routeProps) {
    console.log(token, sessionStorageData);
    if (!token && !sessionStorageData) {
      console.log(routeProps);
      return <Component {...routeProps} />;
    } else {
      console.log('Redirect in PublickOnlyRoute', routeProps);
      return <Redirect to='/chat' />;
    }
  }
  console.log('PublicOnlyRoute');
  return <Route {...rest} render={assignRouteToApply} />;
};
