import React, { ComponentType } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { reactiveVarToken } from '../../GraphQLApp/reactiveVars';

type Props = any;

interface IRoute {
  path: string;
  exact?: boolean;
  private?: boolean;
  component: ComponentType<Props>;
}

type StorageJSON = null | string;

export const PubliсOnlyRoute = ({ component: Component, ...rest }: IRoute) => {
  const sessionStorageDataJSON: StorageJSON =
    sessionStorage.getItem('storageData');
  const token = useReactiveVar(reactiveVarToken);

  function assignRouteToApply(routeProps: any) {
    if (!token && !sessionStorageDataJSON) {
      return <Component {...routeProps} />;
    } else {
      return <Redirect to='/chat' />;
    }
  }
  return <Route {...rest} render={assignRouteToApply} />;
};
