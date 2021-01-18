import React, { useContext } from 'react';
import { useResourse } from '../hooks/resourse';
import { GET_USERS, GET_CHANNELS, GET_DIRECT_MESSAGES } from '../redux/types';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const Context = React.createContext();

const useChatContext = () => {
  return useContext(Context);
};
export const ChatContext = ({ children }) => {
  const users = useSelector((state) => state.users);
  const { i18n } = useTranslation();
  const resUsers = useResourse(GET_USERS);
  const resChannels = useResourse(GET_CHANNELS);
  const resDirectMessages = useResourse(GET_DIRECT_MESSAGES);
  //const resMessages = useResourse(`/api/channel/get-user`);
  //const resMessagesOfDirectMessages = useResourse(`/api/channel/get-user`);
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };
  console.log(users);

  return (
    <Context.Provider
      value={{ resUsers, resChannels, resDirectMessages, changeLanguage }}
    >
      {children}
    </Context.Provider>
  );
};

export default useChatContext;
