import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { LOGOUT_DATA, STORAGE_NAME, AUTH } from '../redux/types.js';
import { wsSend, wsSingleton } from '../WebSocket/soket';
import { reduxServer } from '../hooks/http.hook.js';

export const useAuth = () => {
  const dispatch = useDispatch();

  const login = async (data) => {
    const fetchLogin = await reduxServer('/api/auth/login', null, 'POST', data);
    auth(fetchLogin);
  };

  const register = async (data) => {
    const fetchRegister = await reduxServer(
      '/api/auth/register',
      null,
      'POST',
      data
    );
    auth(fetchRegister);
  };

  /**jwtToken - отримуємо з бекенда *обертаємо в useCallback() - щоб використовувати login в useEffect() як залежність*/
  const auth = useCallback((data) => {
    const toStorage = JSON.stringify({
      userData: data.userData,
      token: data.token,
    });
    sessionStorage.setItem(STORAGE_NAME, toStorage);
    wsSingleton.clientPromise
      .then((wsClient) => console.log('ONLINE'))
      .catch((error) => console.log(error));
    dispatch({ type: AUTH, payload: data });
    const allUserChats = data.userData.channels.concat(
      data.userData.directMessages
    );
    wsSend({
      userRooms: allUserChats,
      meta: 'join',
      userId: data.userData._id,
    });
  }, []);

  const logout = useCallback(() => {
    const storageData = JSON.parse(sessionStorage.getItem(STORAGE_NAME));
    if (
      storageData &&
      storageData.userData &&
      storageData.userData.channels[0]
    ) {
      const allUserChats = storageData.userData.channels.concat(
        storageData.userData.directMessages
      );
      wsSend({
        userRooms: allUserChats,
        userId: storageData.userData._id,
        meta: 'leave',
      });
    }
    sessionStorage.clear();
    dispatch({ type: LOGOUT_DATA });
  }, []);

  const changeStorage = (forStorage) => {
    const data = JSON.parse(sessionStorage.getItem(STORAGE_NAME));
    if (data) {
      const readyStorage = {
        userData: { ...data.userData, ...forStorage },
        token: data.token,
      };
      const stringifyData = JSON.stringify(readyStorage);
      sessionStorage.setItem(STORAGE_NAME, stringifyData);
    }
  };

  return { login, register, logout, changeStorage };
};
