import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { connect } from "react-redux";
import { LOGIN_DATA, LOGOUT_DATA } from "../redux/types.js";

const storageName = "userData";

export const useAuth = () => {
  const dispatch = useDispatch();

  /**
   *jwtToken - отримуємо з бекенда,
   *обертаємо в useCallback() - щоб використовувати login в useEffect() як залежність
   */
  const login = useCallback((userData, token) => {
    console.log("login ->", userData);
    localStorage.setItem(
      storageName,
      JSON.stringify({
        ...userData,
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
    //console.log("changeStorageUserDataActiveChat");
    const data = JSON.parse(localStorage.userData);
    const { channels, directMessages, _id, name, email, token } = { ...data };
    const object = Object.assign(
      {},
      { channels, directMessages, _id, name, email, token },
      { ...newActiveChat }
    );
    localStorage.setItem(
      storageName,
      JSON.stringify({
        ...object,
      })
    );
  };

  const changeStorageUserDataChannels = (newChannels) => {
    //console.log("changeStorageUserDataChannels");
    const data = JSON.parse(localStorage.userData);
    const { directMessages, lastActiveChatId, _id, name, email, token } = {
      ...data,
    };
    const object = Object.assign(
      {},
      { directMessages, lastActiveChatId, _id, name, email, token },
      { ...newChannels }
    );
    localStorage.setItem(
      storageName,
      JSON.stringify({
        ...object,
      })
    );
  };

  const changeStorageUserDataDirectMessages = (newDirectMessages) => {
    //console.log("changeStorageUserDataDirectMessages");
    const data = JSON.parse(localStorage.userData);
    const { channels, lastActiveChatId, _id, name, email, token } = { ...data };
    const object = Object.assign(
      {},
      { channels, lastActiveChatId, _id, name, email, token },
      { ...newDirectMessages }
    );
    localStorage.setItem(
      storageName,
      JSON.stringify({
        ...object,
      })
    );
  };

  useEffect(() => {
    /** JSON.parse() - приводить результат до обєкта */
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      //console.log(data)
      dispatch({
        type: LOGIN_DATA,
        payload: {
          ...data,
        },
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
