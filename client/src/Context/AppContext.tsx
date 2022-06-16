import { createContext } from "react";
import { IAppContext } from "./Models/IAppContext";
import { ICustomThemeContext } from "./Models/ICustomThemeContext";

export const AppContext = createContext<IAppContext>({
  newMsgsBadge: [],
  setNewMsgsBadge: () => {},
  modalAddPeopleIsOpen: false,
  setModalAddPeopleIsOpen: () => {},
});

export const CustomThemeContext = createContext<ICustomThemeContext>({
  currentTheme: "light",
  setTheme: null,
});
