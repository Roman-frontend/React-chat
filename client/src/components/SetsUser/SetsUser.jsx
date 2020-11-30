import React, { useState, useEffect, useCallback, useRef } from "react";
import PersonIcon from "@material-ui/icons/Person";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Grid from "@material-ui/core/Grid";
import { ACTIVE_CHANNEL_ID } from "../../redux/types.js";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { getUsers } from "../../redux/actions/actions.js";
import { useAuth } from "../../hooks/auth.hook.js";
import { DrawTitles } from "./DrawTitles.jsx";
import { Channels } from "./Channels/Channels.jsx";
import { DirectMessages } from "./DirectMessages/DirectMessages";
import "./user-sets.sass";

export function SetsUser(props) {
  const { socket } = props;
  const { changeLocalStorageUserData } = useAuth();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.userData._id);
  const allUsers = useSelector((state) => state.users);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const listDirectMessages = useSelector((state) => state.listDirectMessages);

  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] = useState(false);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const [listChannelsIsOpen, setListChannelsIsOpen] = useState(true);
  const [listMembersIsOpen, setListMembersIsOpen] = useState(true);
  const refIdPrevChannel = useRef(activeChannelId);

  useEffect(() => {
    async function getPeoples() {
      await dispatch(getUsers(token, userId));
    }
    getPeoples();
  }, []);

  useEffect(() => {
    function markActiveLinkChannel(idActiveChannel) {
      const oldMarkChannel = document.querySelector(
        ".user-sets__channel_active"
      );
      const channelForActive = document.getElementById(idActiveChannel);

      if (oldMarkChannel && channelForActive) {
        oldMarkChannel.classList.remove("user-sets__channel_active");
        channelForActive.classList.add("user-sets__channel_active");
      } else if (channelForActive) {
        channelForActive.classList.add("user-sets__channel_active");
      }
    }

    if (activeChannelId) {
      markActiveLinkChannel(activeChannelId);
    }
  }, [activeChannelId]);

  const createLists = useCallback(
    (arrElements, listName) => {
      let allDirectMessages = [
        <div key="1" id="1" className="user-sets__channel">
          <p>general</p>
        </div>,
      ];
      arrElements.forEach((element) =>
        allDirectMessages.push(createLink(element, listName))
      );

      return allDirectMessages;
    },
    [listDirectMessages, allUsers]
  );

  function createLink(linkData, listName) {
    const name =
      listName === "directMessages"
        ? createDirectMsgName(linkData.name)
        : createChannelName(linkData.isPrivate, linkData.name);

    return (
      <div
        key={linkData._id}
        id={linkData._id}
        className="main-font user-sets__channel"
        onClick={() => toActive(linkData._id)}
      >
        {name}
      </div>
    );
  }

  function createDirectMsgName(name) {
    return (
      <Grid container style={{ alignItems: "center" }}>
        <Grid item xs={2}>
          <PersonIcon
            style={{ background: "cadetblue", borderRadius: "0.4rem" }}
          />
        </Grid>
        <Grid item xs={10}>
          {name}
        </Grid>
      </Grid>
    );
  }

  function createChannelName(isPrivate, name) {
    const nameChannel = isPrivate ? (
      <p className="main-font">&#128274;{name}</p>
    ) : (
      <p className="main-font">{`#${name}`}</p>
    );

    return (
      <Grid container className="left-bar__title-name">
        <Grid item xs={10} style={{}}>
          {nameChannel}
        </Grid>
        <Grid item xs={2}>
          <DeleteForeverIcon onClick={() => socket.send("exit")} />
        </Grid>
      </Grid>
    );
  }

  const toActive = useCallback(
    async (idActive) => {
      const prevId = refIdPrevChannel.current
        ? refIdPrevChannel.current
        : activeChannelId;

      if (prevId !== idActive) {
        socket.send(JSON.stringify({ room: prevId, meta: "leave" }));
        refIdPrevChannel.current = idActive;
        socket.send(JSON.stringify({ room: idActive, meta: "join" }));
        changeLocalStorageUserData({ lastActiveChannelId: idActive });
        dispatch({
          type: ACTIVE_CHANNEL_ID,
          payload: idActive,
        });
      }
    },
    [activeChannelId]
  );

  return (
    <div className="main-font left-block">
      <div>
        <DrawTitles
          name={"Channels"}
          divClass={"left-bar__channels"}
          classPlus={"left-bar__first-plus"}
          stateShowing={listChannelsIsOpen}
          seterStateShowing={setListChannelsIsOpen}
          setModalAdd={setModalAddChannelIsOpen}
        />
      </div>
      <Channels
        listChannelsIsOpen={listChannelsIsOpen}
        modalAddChannelIsOpen={modalAddChannelIsOpen}
        setModalAddChannelIsOpen={setModalAddChannelIsOpen}
        createLists={createLists}
      />
      <div>
        <DrawTitles
          name={"Direct messages"}
          divClass={null}
          classPlus={"left-bar__second-plus"}
          stateShowing={listMembersIsOpen}
          seterStateShowing={setListMembersIsOpen}
          setModalAdd={setModalAddPeopleIsOpen}
        />
      </div>
      <DirectMessages
        listMembersIsOpen={listMembersIsOpen}
        modalAddPeopleIsOpen={modalAddPeopleIsOpen}
        setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
        createLists={createLists}
      />
    </div>
  );
}

const mapDispatchToProps = { getUsers };

export default connect(null, mapDispatchToProps)(SetsUser);
