import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import {
  getDirectMessages,
  postDirectMessages,
} from "../../../redux/actions/actions.js";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/auth.hook.js";
import { AddPeopleToDirectMessages } from "../../Modals/AddPeopleToDirectMessages/AddPeopleToDirectMessages.jsx";
import { useCallback } from "react";

export function DirectMessages(props) {
  const {
    listMembersIsOpen,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
    createLists,
  } = props;
  const { changeStorageUserDataDirectMessages } = useAuth();
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.users);
  const token = useSelector((state) => state.token);
  const userData = useSelector((state) => state.userData);
  const listDirectMessages = useSelector((state) => state.listDirectMessages);
  const [invited, setInvited] = useState([]);

  useEffect(() => {
    const storageData = JSON.parse(localStorage.getItem("userData"));
    dispatch(
      getDirectMessages(storageData.token, {
        listDirectMessages: storageData.directMessages,
      })
    );
  }, []);

  useEffect(() => {
    if (listDirectMessages) {
      const newList = listDirectMessages.map((directMsg) => directMsg._id);
      changeStorageUserDataDirectMessages({ directMessages: newList });
    }
  }, [listDirectMessages]);

  const createArrDirectMessages = useCallback(() => {
    if (listDirectMessages && allUsers) {
      let allRowDirectMessages = [];
      listDirectMessages.forEach((directMessage) => {
        /* const invitedAllData = allUsers.filter(
          (user) => user._id === directMessage.invited._id
        );
        allRowDirectMessages.push(invitedAllData[0]); */
        allRowDirectMessages.push(directMessage);
      });
      return createLists(allRowDirectMessages, "directMessages");
    }
  }, [listDirectMessages, allUsers]);

  async function doneInvite(action) {
    setInvited([]);
    setModalAddPeopleIsOpen(false);

    if (action === "invite" && invited[0]) {
      let dataInvitedPeoples = [];
      invited.forEach((people) => {
        const { _id, name, email } = { ...people };
        dataInvitedPeoples.push({ _id, name, email });
      });
      const body = {
        inviter: {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
        },
        invitedUsers: dataInvitedPeoples,
      };
      await dispatch(postDirectMessages(token, body));
    }
  }

  return (
    <div
      className="user-sets__users"
      style={{ display: listMembersIsOpen ? "block" : "none" }}
    >
      {createArrDirectMessages()}
      <div className="user-sets__channel">
        <p onClick={() => setModalAddPeopleIsOpen(true)}>+ Invite people</p>
      </div>
      <AddPeopleToDirectMessages
        doneInvite={doneInvite}
        invited={invited}
        setInvited={setInvited}
        modalAddPeopleIsOpen={modalAddPeopleIsOpen}
        setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
      />
      <div className="user-sets__channel">
        <Link className="main-font" to={`/filterContacts`}>
          Filter Contants
        </Link>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  getDirectMessages,
  postDirectMessages,
};

export default connect(null, mapDispatchToProps)(DirectMessages);

//НЕ ВИДАЛЯТИ ПОКИЩО створює список учасників активного каналу
/*  
  import {useSelector} from 'react-redux'
  const allChannels = useSelector(state => state.channels)
  const activeChannelId = useSelector(state => state.activeChannelId)

  const activeChannel = useMemo(() => {
    if (activeChannelId && allChannels) {
      return allChannels.filter(channel => channel._id === activeChannelId)
    }
  }, [activeChannelId, allChannels]) 
  const createListMembers = useCallback(() => {
    return activeChannel[0].members.map( member => {
      return (
        <div key={member._id} id={member._id} className="user-sets__people">
          <Link className="main-font" to={`/chat`}>{member.name}</Link>
        </div>
      )
    })
  }, [activeChannel])*/
