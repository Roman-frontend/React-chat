import React, { useState, useEffect, useMemo, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { getUsers } from "../../redux/actions/actions.js";
import { Channels } from "../Channels/Channels.jsx";
import { ChannelMembers } from "../ChannelMembers/ChannelMembers.jsx";
import "./user-sets.sass";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexGrow: 1,
    fontSize: "4vh",
    textAlign: "right",
    margin: 0,
  },
}));

export function SetsUser(props) {
  const { socket } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.users);
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.userData._id);
  const allChannels = useSelector((state) => state.channels);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const [listChannelsIsOpen, setListChannelsIsOpen] = useState(true);
  const [listMembersIsOpen, setListMembersIsOpen] = useState(true);
  const channelsIconRef = useRef();
  const channelsTitleRef = useRef();
  const msgIconRef = useRef();
  const msgTitleRef = useRef();

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

  useEffect(() => {
    function addEvent(focusedElement, elementForDraw = null) {
      const eventElement = elementForDraw ? elementForDraw : focusedElement;
      focusedElement.current.addEventListener("mouseover", () => {
        eventElement.current.classList.add("left-bar__title_active");
      });

      focusedElement.current.addEventListener("mouseout", () => {
        eventElement.current.classList.remove("left-bar__title_active");
      });
    }

    addEvent(channelsIconRef);
    addEvent(channelsTitleRef, channelsIconRef);
    addEvent(msgIconRef);
    addEvent(msgTitleRef, msgIconRef);
  }, []);

  function drawTitles(
    name,
    iconRef,
    titleRef,
    divClass = null,
    classPlus,
    seterStateShowing,
    stateShowing
  ) {
    const stateIcon = stateShowing ? (
      <KeyboardArrowDownIcon fontSize="large" />
    ) : (
      <ChevronRightIcon fontSize="large" />
    );

    return (
      <div
        className={(classes.root, divClass)}
        onClick={() => seterStateShowing(!stateShowing)}
      >
        <Grid container className="left-bar__title-name">
          <Grid
            item
            xs={1}
            ref={iconRef}
            style={{ margin: "0px 12px 0px 14px" }}
          >
            {stateIcon}
          </Grid>
          <Grid item xs={8} ref={titleRef}>
            {name}
          </Grid>
          <Grid
            item
            xs={1}
            style={{ font: "2rem serif" }}
            className={classPlus}
          >
            +
          </Grid>
        </Grid>
      </div>
    );
  }

  return (
    <div className="main-font left-block">
      <div>
        {drawTitles(
          "Channels",
          channelsIconRef,
          channelsTitleRef,
          "left-bar__channels",
          "left-bar__first-plus",
          setListChannelsIsOpen,
          listChannelsIsOpen
        )}
      </div>
      <Channels
        isNotMembers={isNotMembers}
        listChannelsIsOpen={listChannelsIsOpen}
        socket={socket}
      />
      <div>
        {drawTitles(
          "Direct messages",
          msgIconRef,
          msgTitleRef,
          null,
          "left-bar__second-plus",
          setListMembersIsOpen,
          listMembersIsOpen
        )}
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
