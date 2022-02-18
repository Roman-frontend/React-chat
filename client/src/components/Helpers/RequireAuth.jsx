import { Navigate } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { reactiveVarToken } from '../../GraphQLApp/reactiveVars';

export function RequireAuth({ children, redirectTo }) {
  const sessionStorageDataJSON = sessionStorage.getItem('storageData');
  const token = useReactiveVar(reactiveVarToken);

  if (!token && !sessionStorageDataJSON) {
    return children;
  }
  return <Navigate to={redirectTo} />;
}
