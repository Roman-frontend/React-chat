import { memo, useCallback, useEffect, useState } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import {
  reactiveOnlineMembers,
  reactiveVarPrevAuth,
} from "../../GraphQLApp/reactiveVars";
import { GET_USERS } from "../../GraphQLApp/queryes";
import Header from "../../components/Header/Header";
import Conversation from "../../components/Conversation/Conversation";
import SetsUser from "../../components/SetsUser/SetsUser";
import {
  registerEnterPage,
  registerOnlineUser,
  registerUnloadPage,
  registerOfflineUser,
} from "../../components/Helpers/registerUnload";
import {
  CHANNELS,
  GET_DIRECT_MESSAGES,
} from "../../components/SetsUser/SetsUserGraphQL/queryes";
import { Loader } from "../../components/Helpers/Loader";
import { activeChatId } from "../../GraphQLApp/reactiveVars";
import setStylesChat from "./styles";

interface IStyles {
  root?: React.CSSProperties;
  workSpace?: React.CSSProperties;
  header?: React.CSSProperties;
  conversation?: React.CSSProperties;
}

interface IBadge {
  id: string;
  num: number;
}

export const Chat = memo(() => {
  const usersOnline = useReactiveVar(reactiveOnlineMembers);
  const activeChat = useReactiveVar(activeChatId);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;
  const { loading: lUsers } = useQuery(GET_USERS);
  const { loading: lChannels, data: dChannels } = useQuery(CHANNELS);
  const { loading: lDms, data: dDms } = useQuery(GET_DIRECT_MESSAGES);
  const [isErrorInPopap, setIsErrorInPopap] = useState(false);
  const [isOpenLeftBar, setIsOpenLeftBar] = useState(true);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [dataForBadgeInformNewMsg, setChatsHasNewMsgs] = useState<
    [] | IBadge[]
  >([]);
  const [styles, setStyles] = useState<IStyles>({});
  const theme = useTheme();

  useEffect(() => {
    setStyles(setStylesChat(theme));
  }, [theme]);

  useEffect(() => {
    showConversation();
  }, [activeChat, modalAddPeopleIsOpen]);

  useEffect(() => {
    if (
      (dChannels?.userChannels?.length || dDms?.directMessages?.length) &&
      (activeChannelId || activeDirectMessageId)
    ) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [activeChannelId, activeDirectMessageId, lChannels, lDms]);

  useEffect(() => {
    if (!(dChannels?.userChannels?.length || dDms?.directMessages?.length)) {
      setShow(false);
    }
  }, [dChannels, dDms]);

  useEffect(() => {
    const storage = sessionStorage.getItem("storageData");
    if (storage) {
      const parsedStorage = JSON.parse(storage);
      reactiveVarPrevAuth(parsedStorage);
    }
    registerOnlineUser(usersOnline);
    registerEnterPage();
    return registerUnloadPage("Leaving page", registerOfflineUser);
  }, []);

  const showConversation = useCallback(() => {
    if (show) {
      return (
        <Conversation
          modalAddPeopleIsOpen={modalAddPeopleIsOpen}
          setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
          isErrorInPopap={isErrorInPopap}
          setIsErrorInPopap={setIsErrorInPopap}
          dataForBadgeInformNewMsg={dataForBadgeInformNewMsg}
          setChatsHasNewMsgs={setChatsHasNewMsgs}
        />
      );
    }

    return null;
  }, [show]);

  if (lUsers && lChannels && lDms) {
    return <Loader />;
  }

  return (
    <Box data-testid="chat" style={styles.root}>
      <Grid container spacing={2} style={styles.workSpace}>
        <CssBaseline />
        <Grid item xs={12} style={styles.header}>
          <Header
            isOpenLeftBar={isOpenLeftBar}
            setIsOpenLeftBar={setIsOpenLeftBar}
          />
        </Grid>
        <SetsUser
          isErrorInPopap={isErrorInPopap}
          setIsErrorInPopap={setIsErrorInPopap}
          isOpenLeftBar={isOpenLeftBar}
          setIsOpenLeftBar={setIsOpenLeftBar}
          modalAddPeopleIsOpen={modalAddPeopleIsOpen}
          dataForBadgeInformNewMsg={dataForBadgeInformNewMsg}
          setChatsHasNewMsgs={setChatsHasNewMsgs}
        />
        <Box component="main" sx={styles.conversation}>
          <main>{showConversation()}</main>
        </Box>
      </Grid>
    </Box>
  );
});
