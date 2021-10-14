import React, { useEffect } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import CustomizedSnackbars from '../Helpers/AlertAction.jsx';
import { CHANNELS, GET_DIRECT_MESSAGES } from './SetsUserGraphQL/queryes';
import { activeChatId } from '../../GraphQLApp/reactiveVars';
import { useStyles } from '../../pages/Chat/ChatStyles.jsx';
import { Channels } from './Channels/Channels.jsx';
import { DirectMessages } from './DirectMessages/DirectMessages.jsx';
import './user-sets.sass';

export default function SetsUser(props) {
  const { isOpenLeftBar, setIsOpenLeftBar, alertData, setAlertData } = props;
  const classes = useStyles();
  const { data: allChannels } = useQuery(CHANNELS);
  const { data: listDirectMessages } = useQuery(GET_DIRECT_MESSAGES);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;

  useEffect(() => {
    if (activeChannelId || activeDirectMessageId) {
      return;
    }
    if (
      allChannels &&
      Array.isArray(allChannels.userChannels) &&
      allChannels.userChannels[0] &&
      allChannels.userChannels[0].id
    ) {
      activeChatId({ activeChannelId: allChannels.userChannels[0].id });
    } else if (
      listDirectMessages &&
      Array.isArray(listDirectMessages.directMessages) &&
      listDirectMessages.directMessages[0] &&
      listDirectMessages.directMessages[0].id
    ) {
      activeChatId({
        activeDirectMessageId: listDirectMessages.directMessages[0].id,
      });
    }
  }, [allChannels, listDirectMessages, activeChannelId, activeDirectMessageId]);

  return (
    <div className='left-block'>
      <div className={classes.toolbar}>
        <IconButton />
      </div>
      <Divider />
      <Channels setAlertData={setAlertData} isOpenLeftBar={isOpenLeftBar} />
      <DirectMessages
        setAlertData={setAlertData}
        isOpenLeftBar={isOpenLeftBar}
        setIsOpenLeftBar={setIsOpenLeftBar}
      />
      <CustomizedSnackbars alertData={alertData} setAlertData={setAlertData} />
    </div>
  );
}
