import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useQuery, useReactiveVar } from '@apollo/client';
import { reactiveVarToken } from '../GraphQL/reactiveVariables';
import { AUTH } from '../GraphQL/queryes';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { data: auth } = useQuery(AUTH);
  const sessionStorageData = JSON.parse(sessionStorage.getItem('storageData'));
  const reactiveToken = useReactiveVar(reactiveVarToken);

  function assignRouteToApply(routeProps) {
    console.log(reactiveToken, sessionStorageData);
    if (reactiveToken || (sessionStorageData && sessionStorageData.token)) {
      return <Component {...routeProps} />;
    } else {
      return <Redirect to='/signIn' />;
    }
  }

  return <Route {...rest} render={assignRouteToApply} />;
};
