import ITheme from "./Models/ITheme";

export default function setStylesChat(theme: ITheme) {
  return {
    root: {
      display: "flex",
      alignItems: "center",
      flexFlow: "column",
      height: "100vh",
      lineHeight: "normal",
      background: "#dfe0f7",
      minWidth: 890,
    },
    workSpace: {
      minWidth: 550,
      maxWidth: 900,
      height: 600,
      background: theme.palette.primary.main,
    },
    header: { paddingLeft: 8 },
    conversation: {
      height: 520,
      flexGrow: 1,
      p: "20px 0px 0px 0px",
      backgroundColor: theme.palette.primary.light,
    },
  };
}
