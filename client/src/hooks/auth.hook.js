import { useCallback, useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { LOGIN_DATA, LOGOUT_DATA } from '../redux/types.js';

const storageName = 'userData';

export const useAuth = () => {
  const dispatch = useDispatch();

  /**
   *jwtToken - отримуємо з бекенда,
   *обертаємо в useCallback() - щоб використовувати login в useEffect() як залежність
   */
  const login = useCallback((userData, token) => {
    //console.log('login ->', userData, token);
    localStorage.setItem(
      storageName,
      JSON.stringify({
        userData,
        token,
      })
    );
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(storageName);
    dispatch({
      type: LOGOUT_DATA,
      payload: null,
    });
  }, []);

  const changeStorageUserDataActiveChat = (newActiveChat) => {
    const data = JSON.parse(localStorage.userData);
    const { channels, directMessages, _id, name, email } = { ...data.userData };
    const token = data.token;
    const object = Object.assign(
      {},
      { channels, directMessages, _id, name, email },
      { ...newActiveChat }
    );
    /* console.log('changeStorageUserDataActiveChat ->', {
      userData: { ...object },
      token,
    }); */
    localStorage.setItem(
      storageName,
      JSON.stringify({
        userData: { ...object },
        token,
      })
    );
  };

  const changeStorageUserDataChannels = (newChannels) => {
    //console.log("changeStorageUserDataChannels");
    const data = JSON.parse(localStorage.userData);
    //console.log(data);
    const { directMessages, lastActiveChatId, _id, name, email } = {
      ...data.userData,
    };
    const token = data.token;
    const object = Object.assign(
      {},
      { directMessages, lastActiveChatId, _id, name, email },
      { ...newChannels }
    );
    /* console.log('changeStorageUserDataChannels ->', {
      userData: { ...object },
      token,
    }); */
    localStorage.setItem(
      storageName,
      JSON.stringify({
        userData: { ...object },
        token,
      })
    );
  };

  const changeStorageUserDataDirectMessages = (newDirectMessages) => {
    //console.log('changeStorageUserDataDirectMessages');
    const data = JSON.parse(localStorage.userData);
    const { channels, lastActiveChatId, _id, name, email } = {
      ...data.userData,
    };
    const token = data.token;
    const object = Object.assign(
      {},
      { channels, lastActiveChatId, _id, name, email },
      { ...newDirectMessages }
    );
    /* console.log('changeStorageUserDataDirectMessages ->', {
      userData: { ...object },
      token,
    }); */
    localStorage.setItem(
      storageName,
      JSON.stringify({
        userData: { ...object },
        token,
      })
    );
  };

  useLayoutEffect(() => {
    /** JSON.parse() - приводить результат до обєкта */
    const data = JSON.parse(localStorage.getItem(storageName));
    //console.log(data);

    if (data && data.token && data.userData) {
      dispatch({
        type: LOGIN_DATA,
        payload: data,
      });
    }
  }, [login]);

  return {
    login,
    logout,
    changeStorageUserDataActiveChat,
    changeStorageUserDataDirectMessages,
    changeStorageUserDataChannels,
  };
};

export default connect(null, null)(useAuth);
