import React from "react";
import IBadge from "../../Models/IBadge";

export interface IAppContext {
  appId: string | null;
  newMsgsBadge: [] | IBadge[];
  setNewMsgsBadge: React.Dispatch<React.SetStateAction<[] | IBadge[]>>;
  modalAddPeopleIsOpen: boolean;
  setModalAddPeopleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
