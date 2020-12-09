import React, { useContext } from 'react';
import { useResourse } from '../hooks/resourse';
import { GET_USERS, GET_CHANNELS, GET_DIRECT_MESSAGES } from '../redux/types';

const Context = React.createContext();

const useChatContext = () => {
  //1
  return useContext(Context); //2
};
export const ChatContext = ({ children }) => {
  console.log('context');
  const resUsers = useResourse(GET_USERS);
  const resChannels = useResourse(GET_CHANNELS);
  const resDirectMessages = useResourse(GET_DIRECT_MESSAGES);
  const resMessages = useResourse(`/api/channel/get-user`);
  const resMessagesOfDirectMessages = useResourse(`/api/channel/get-user`);

  return (
    <Context.Provider value={{ resUsers, resChannels, resDirectMessages }}>
      {children}
    </Context.Provider>
  );
};

export default useChatContext;
