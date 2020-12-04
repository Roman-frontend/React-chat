import React, { useState, useEffect, useCallback, useMemo } from "react";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { POST_ADD_PEOPLES_TO_CHANNEL } from "../../../redux/types.js";
import { getUsers, postData } from "../../../redux/actions/actions.js";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { ConversationMembers } from "../../Modals/ConversationHeader/ConversationMembers";
import { AddPeopleToChannel } from "../../Modals/AddPeopleToChannel/AddPeopleToChannel";
import "./ConversationHeader.sass";

export function ConversationHeader() {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels);
  const userId = useSelector((state) => state.userData._id);
  const token = useSelector((state) => state.token);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const activeDirectMessageId = useSelector(
    (state) => state.activeDirectMessageId
  );
  const listDirectMessages = useSelector((state) => state.listDirectMessages);
  const [invited, setInvited] = useState([]);
  const [modalIsShowsMembers, setModalIsShowsMembers] = useState(false);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);

  useEffect(() => {
    async function getPeoples() {
      await dispatch(getUsers(token, userId));
    }

    if (userId) getPeoples();
  }, [userId]);

  const activeChannel = useMemo(() => {
    if (channels) {
      if (activeChannelId) {
        return channels.filter((channel) => channel._id === activeChannelId)[0];
      } else if (activeDirectMessageId) {
        return null;
      }
    }
  }, [activeChannelId, channels]);

  const createName = useCallback(() => {
    let chatName = activeChannel ? activeChannel.name : "general";
    if (activeDirectMessageId && listDirectMessages) {
      const activeDirectMessage = listDirectMessages.filter((directMessage) => {
        return directMessage._id === activeDirectMessageId;
      })[0];
      chatName =
        activeDirectMessage.inviter._id === userId
          ? activeDirectMessage.invited.name
          : activeDirectMessage.inviter.name;
    }

    return <b className="conversation__name">✩ {chatName}</b>;
  }, [activeChannel, activeDirectMessageId]);

  const createMembers = useCallback(() => {
    return (
      <div style={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={1}
          style={{ height: "4.3rem", alignContent: "center" }}
        >
          <Grid item xs={5} stule={{ alignSelf: "center" }}>
            <PeopleAltIcon
              style={{ fontSize: 40, cursor: "pointer" }}
              onClick={() => setModalIsShowsMembers(true)}
            />
            <b>{activeChannel ? activeChannel.members.length : 1}</b>
          </Grid>
          <Grid item xs={6}>
            <GroupAddIcon
              style={{ fontSize: 45, cursor: "pointer" }}
              onClick={() => openModalAddPeoples()}
            />
          </Grid>
        </Grid>
      </div>
    );
  }, [activeChannel]);

  function openModalAddPeoples() {
    if (activeChannelId) {
      setModalAddPeopleIsOpen(true);
    }
  }

  async function doneInvite(action) {
    if (action === "invite") {
      await dispatch(
        postData(POST_ADD_PEOPLES_TO_CHANNEL, token, invited, activeChannelId)
      );
    }
    setInvited([]);
    setModalAddPeopleIsOpen(false);
  }

  //console.log(modalIsShowsMembers)

  return (
    <div className="conversation__field-name">
      <Grid container spacing={1} style={{ alignItems: "center" }}>
        <Grid item xs={10}>
          {createName()}
        </Grid>
        <Grid item xs={2}>
          {createMembers()}
        </Grid>
      </Grid>
      <ConversationMembers
        activeChannel={activeChannel}
        modalIsShowsMembers={modalIsShowsMembers}
        setModalIsShowsMembers={setModalIsShowsMembers}
      />
      <AddPeopleToChannel
        doneInvite={doneInvite}
        invited={invited}
        setInvited={setInvited}
        modalAddPeopleIsOpen={modalAddPeopleIsOpen}
        setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
      />
    </div>
  );
}

const mapDispatchToProps = { getUsers, postData };

export default connect(null, mapDispatchToProps)(ConversationHeader);
