import { useCallback } from 'react';
import { STORAGE_NAME } from '../redux/types.js';
import { wsSend, wsSingleton } from '../WebSocket/soket';
import {
  reactiveVarToken,
  reactiveVarChannels,
  reactiveDirectMessages,
  reactiveVarEmail,
  reactiveVarId,
  reactiveVarName,
  authReactiveVar,
} from '../components/GraphQL/reactiveVariables';
import { useReactiveVar } from '@apollo/client';

export const useAuth = () => {
  const channelsId = useReactiveVar(reactiveVarChannels);
  const directMessagesId = useReactiveVar(reactiveDirectMessages);
  const userId = useReactiveVar(reactiveVarId);

  const auth = useCallback((data) => {
    const toStorage = JSON.stringify(data);
    sessionStorage.setItem(STORAGE_NAME, toStorage);
    wsSingleton.clientPromise
      .then((wsClient) => console.log('ONLINE'))
      .catch((error) => console.log(error));
    const userRooms = data.channels.concat(data.directMessages);
    wsSend({ userRooms, meta: 'join', userId: data.id });
  }, []);

  const logout = useCallback(() => {
    if (Array.isArray(channelsId) && Array.isArray(directMessagesId)) {
      const userRooms = channelsId.concat(directMessagesId);
      wsSend({ userRooms, userId, meta: 'leave' });
    }
    sessionStorage.clear();
    reactiveVarToken(null);
    authReactiveVar(null);
    reactiveVarName(null);
    reactiveVarEmail(null);
    reactiveVarId(null);
    reactiveVarChannels(null);
    reactiveDirectMessages(null);
  }, []);

  return { auth, logout };
};
