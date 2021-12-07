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

export const PubliсOnlyRoute = (props: IRoute) => {
  const { component: Component, ...rest } = props;
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
