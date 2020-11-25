import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { getUsers } from "../../redux/actions/actions.js";
import { DrawTitles } from "./DrawTitles.jsx";
import { Channels } from "./Channels/Channels.jsx";
import { ChannelMembers } from "./ChannelMembers/ChannelMembers.jsx";
import "./user-sets.sass";

export function SetsUser(props) {
  const { socket } = props;
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.users);
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.userData._id);
  const allChannels = useSelector((state) => state.channels);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const [listChannelsIsOpen, setListChannelsIsOpen] = useState(true);
  const [listMembersIsOpen, setListMembersIsOpen] = useState(true);

  const activeChannel = useMemo(() => {
    if (activeChannelId && allChannels) {
      return allChannels.filter((channel) => channel._id === activeChannelId);
    }
  }, [activeChannelId, allChannels]);

  const isNotMembers = useMemo(() => {
    if (allUsers && activeChannel) {
      if (activeChannel[0]) {
        return allUsers.filter(
          (user) => activeChannel[0].members.includes(user._id) === false
        );
      }
    }
  }, [allUsers, activeChannel]);

  useEffect(() => {
    async function getPeoples() {
      await dispatch(getUsers(token, userId));
    }
    getPeoples();
  }, []);

  return (
    <div className="main-font left-block">
      <div>
        <DrawTitles
          name={"Channels"}
          divClass={"left-bar__channels"}
          classPlus={"left-bar__first-plus"}
          stateShowing={listChannelsIsOpen}
          seterStateShowing={setListChannelsIsOpen}
        />
      </div>
      <Channels
        isNotMembers={isNotMembers}
        listChannelsIsOpen={listChannelsIsOpen}
        socket={socket}
      />
      <div>
        <DrawTitles
          name={"Direct messages"}
          divClass={null}
          classPlus={"left-bar__second-plus"}
          stateShowing={listMembersIsOpen}
          seterStateShowing={setListMembersIsOpen}
        />
      </div>
      <ChannelMembers
        isNotMembers={isNotMembers}
        listMembersIsOpen={listMembersIsOpen}
      />
    </div>
  );
}

const mapDispatchToProps = {
  getUsers,
};

export default connect(null, mapDispatchToProps)(SetsUser);
