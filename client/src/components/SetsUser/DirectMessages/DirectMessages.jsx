import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import {
  getDirectMessages,
  postDirectMessages,
} from "../../../redux/actions/actions.js";
import { Link } from "react-router-dom";
import { AddPeopleToDirectMessages } from "../../Modals/AddPeopleToDirectMessages/AddPeopleToDirectMessages.jsx";
import { useCallback } from "react";

export function DirectMessages(props) {
  const {
    listMembersIsOpen,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
    createLists,
  } = props;
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.users);
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.userData._id);
  const listDirectMessages = useSelector((state) => state.listDirectMessages);
  const [invited, setInvited] = useState([]);

  useEffect(() => {
    dispatch(getDirectMessages(token, userId));
  }, []);

  const createArrDirectMessages = useCallback(() => {
    if (listDirectMessages && allUsers) {
      let allRowDirectMessages = [];
      listDirectMessages.invited.map((invitedId) => {
        const invitedAllData = allUsers.filter(
          (user) => user._id === invitedId
        );
        console.log(invitedAllData);
        allRowDirectMessages.push(invitedAllData[0]);
      });
      console.log(allRowDirectMessages);
      return createLists(allRowDirectMessages, "directMessages");
    }
  }, [listDirectMessages, allUsers]);

  async function doneInvite(action) {
    setInvited([]);
    setModalAddPeopleIsOpen(false);

    if (action === "invite" && invited[0]) {
      const body = { inviter: userId, invitedUsers: invited };
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
