import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PersonIcon from '@material-ui/icons/Person';
import './ConversationHeader.sass';
import { useQuery, useReactiveVar } from '@apollo/client';
import { AUTH, GET_USERS } from '../../../GraphQLApp/queryes';
import { GET_DIRECT_MESSAGES } from '../../SetsUser/SetsUserGraphQL/queryes';
import { activeChatId } from '../../../GraphQLApp/reactiveVars';
import { determineActiveChat } from '../../Helpers/determineActiveChat';

export const ConversationHeaderDrMsg = (props) => {
  const { isOpenRightBarDrMsg, setIsOpenRightBarDrMsg } = props;
  const { data: auth } = useQuery(AUTH);
  const { data: listDirectMessages } = useQuery(GET_DIRECT_MESSAGES);
  const { data: allUsers } = useQuery(GET_USERS);
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;

  function createName() {
    if (
      activeDirectMessageId &&
      listDirectMessages &&
      Array.isArray(listDirectMessages.directMessages) &&
      listDirectMessages.directMessages[0] &&
      allUsers &&
      Array.isArray(allUsers.users) &&
      allUsers.users[0]
    ) {
      const activeDirectMessage = listDirectMessages.directMessages.find(
        (directMessage) => {
          return directMessage.id === activeDirectMessageId;
        }
      );
      if (activeDirectMessage && auth && auth.id) {
        const name = determineActiveChat(
          activeDirectMessage,
          allUsers.users,
          auth.id
        );
        return <b className='conversation__name'>✩ {name}</b>;
      }
      return '#general';
    }
  }

  function openRightBarDrMsg() {
    setIsOpenRightBarDrMsg(!isOpenRightBarDrMsg);
  }

  return (
    <div className='conversation__field-name'>
      <Grid
        container
        spacing={1}
        style={{ alignItems: 'center', height: '4.3rem', padding: '0vh 1vw' }}
        justify='space-between'
      >
        <Grid item xs={9}>
          {createName()}
        </Grid>
        <Grid item xs={1}>
          <IconButton
            edge='end'
            aria-label='account of current user'
            aria-haspopup='true'
            color='inherit'
            onClick={openRightBarDrMsg}
          >
            <PersonIcon
              style={{
                background: 'cadetblue',
                borderRadius: '50%',
                fontSize: 40,
                cursor: 'pointer',
              }}
            />
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
};
