import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useQuery, useReactiveVar } from '@apollo/client';
import { reactiveVarToken } from '../../GraphQLApp/reactiveVariables';
import { AUTH } from '../../GraphQLApp/queryes';

export const PubliсOnlyRoute = ({ component: Component, ...rest }) => {
  const sessionStorageData = JSON.parse(sessionStorage.getItem('storageData'));
  const token = useReactiveVar(reactiveVarToken);
  const { data: auth, loading } = useQuery(AUTH);
  //const data = reactiveVarToken();

  function assignRouteToApply(routeProps) {
    console.log(token, sessionStorageData);
    if (!token && !sessionStorageData) {
      return <Component {...routeProps} />;
    } else {
      return <Redirect to='/chat' />;
    }
  }
  console.log('PublicOnlyRoute');
  if (loading) return <div>"Loading"</div>;
  return <Route {...rest} render={assignRouteToApply} />;
};
