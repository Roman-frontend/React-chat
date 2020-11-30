import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { SelectPeople } from "../SelectPeople/SelectPeople.jsx";
import "./add-people-to-channel.sass";
Modal.setAppElement("#root");

export function AddPeopleToDirectMessages(props) {
  const users = useSelector((state) => state.users);
  const userData = useSelector((state) => state.userData);
  const listDirectMessages = useSelector((state) => state.listDirectMessages);
  const {
    doneInvite,
    invited,
    setInvited,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
  } = props;
  const [notInvited, setNotInvited] = useState(null);
  const parrentDivRef = useRef();
  const buttonCloseRef = useRef();
  const buttonDoneRef = useRef();
  const heightParrentDiv = "set-channel__invite_height";

  useEffect(() => {
    if (users && listDirectMessages) {
      let allNotInvited = users.filter((user) => user._id !== userData._id);
      listDirectMessages.invited.forEach((invitedId) => {
        allNotInvited = allNotInvited.filter((user) => user._id !== invitedId);
      });
      setNotInvited(allNotInvited);
    }
  }, [users, listDirectMessages]);

  return (
    <Modal
      isOpen={modalAddPeopleIsOpen}
      onRequestClose={() => setModalAddPeopleIsOpen(false)}
      className={"modal-content"}
      overlayClassName={"modal-overlay"}
    >
      <div className="set-channel" ref={parrentDivRef}>
        <p className="set-channel-forms__main-label-text">
          Invite people to {userData.name}
        </p>
        <SelectPeople
          invited={invited}
          setInvited={setInvited}
          notInvited={notInvited}
          setNotInvited={setNotInvited}
          parrentDivRef={parrentDivRef}
          buttonCloseRef={buttonCloseRef}
          buttonDoneRef={buttonDoneRef}
          heightParrentDiv={heightParrentDiv}
        />

        <button
          className="set-channel__button"
          ref={buttonCloseRef}
          onClick={doneInvite}
        >
          Close
        </button>

        <button
          type="submit"
          className="set-channel__button"
          ref={buttonDoneRef}
          onClick={() => doneInvite("invite")}
        >
          Invite
        </button>
      </div>
    </Modal>
  );
}
