import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { getData } from "../../../redux/actions/actions.js";
import { GET_CHANNELS } from "../../../redux/types.js";
import Modal from "react-modal";
import { useAuth } from "../../../hooks/auth.hook.js";
import { AddChannel } from "../../Modals/AddChannel/AddChannel";
import "./channels.sass";
Modal.setAppElement("#root");

export function Channels(props) {
  const {
    modalAddChannelIsOpen,
    setModalAddChannelIsOpen,
    listChannelsIsOpen,
    createLists,
  } = props;
  const dispatch = useDispatch();
  const allChannels = useSelector((state) => state.channels);
  const token = useSelector((state) => state.token);
  const userData = useSelector((state) => state.userData);
  const { changeLocalStorageUserData } = useAuth();

  useEffect(() => {
    async function getChannels() {
      await dispatch(getData(GET_CHANNELS, token, null, userData.channels));
    }
    changeLocalStorageUserData(userData);
    getChannels();
  }, [userData]);

  const createLinksChannels = useCallback(() => {
    if (allChannels) {
      return createLists(allChannels);
    }
  }, [allChannels]);

  return (
    <div
      className="user-sets__users"
      style={{ display: listChannelsIsOpen ? "block" : "none" }}
    >
      <Modal
        isOpen={modalAddChannelIsOpen}
        onRequestClose={() => setModalAddChannelIsOpen(false)}
        className={"modal-content"}
        overlayClassName={"modal-overlay"}
      >
        <AddChannel setModalAddChannelIsOpen={setModalAddChannelIsOpen} />
      </Modal>
      {createLinksChannels(allChannels)}
      <div className="user-sets__channel user-sets__channel_add">
        <p className="main-font" onClick={() => setModalAddChannelIsOpen(true)}>
          + Add channel
        </p>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  getData,
};

export default connect(null, mapDispatchToProps)(Channels);
