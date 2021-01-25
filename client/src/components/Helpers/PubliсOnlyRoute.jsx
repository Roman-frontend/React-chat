import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const PubliсOnlyRoute = ({ component: Component, ...rest }) => {
  const token = useSelector((state) => state.token);
<<<<<<< HEAD
=======
  //const { login } = useAuth();
>>>>>>> bd58be86d4452ab3b6fe2b628dc8f01b0733d449
  console.log('PublicOnlyRoute');

  function assignRouteToApply(routeProps) {
    if (!token) {
      return <Component {...routeProps} />;
    } else {
      return <Redirect to='/chat' />;
    }
  }

  return <Route {...rest} render={assignRouteToApply} />;
};
