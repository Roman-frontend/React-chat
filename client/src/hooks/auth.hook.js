import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { LOGOUT_DATA, STORAGE_NAME, POST_LOGIN } from '../redux/types.js';
import { wsSend } from '../WebSocket/soket';
import { reduxServer } from '../hooks/http.hook.js';

export const useAuth = () => {
  const dispatch = useDispatch();

  /**jwtToken - отримуємо з бекенда *обертаємо в useCallback() - щоб використовувати login в useEffect() як залежність*/
  const login = useCallback(async (loginData) => {
    const resLogin = await reduxServer(
      '/api/auth/login',
      null,
      'POST',
      loginData
    );
    const toStorage = JSON.stringify({
      userData: resLogin.userData,
      token: resLogin.token,
    });
    sessionStorage.setItem(STORAGE_NAME, toStorage);
    dispatch({ type: POST_LOGIN, payload: resLogin });
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

  return {
    login,
    logout,
    changeStorage,
  };
};
