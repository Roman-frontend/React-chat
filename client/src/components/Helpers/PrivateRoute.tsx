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

interface IStorage {
  id: string;
  name: string;
  email: string;
  channels: string[] | [];
  directMessages: string[] | [];
  token: string;
}

type StorageJSON = null | string;

export const PrivateRoute = ({ component: Component, ...rest }: IRoute) => {
  const JSONSessionStorage: StorageJSON = sessionStorage.getItem('storageData');
  let sessionStorageData: IStorage | null;
  if (JSONSessionStorage) {
    sessionStorageData = JSON.parse(JSONSessionStorage);
  }
  const reactiveToken = useReactiveVar(reactiveVarToken);

  function assignRouteToApply(routeProps: any) {
    if (reactiveToken || sessionStorageData?.token) {
      return <Component {...routeProps} />;
    } else {
      return <Redirect to='/signIn' />;
    }
  }

  return <Route {...rest} render={assignRouteToApply} />;
};
