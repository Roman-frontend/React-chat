import React, { useMemo, memo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
import { useTheme } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneIcon from "@mui/icons-material/Done";
import Box from "@mui/material/Box";
import imageProfile from "../../../../images/User-Icon.png";
import { messageDate } from "../../../Helpers/Date/DateCreators";
import { GET_USERS } from "../../../../GraphQLApp/queryes";
import { Loader } from "../../../Helpers/Loader";
import IMessage from "../../Models/IMessage";
import "./message.sass";

interface IProps {
  message: IMessage;
  openPopup: string;
  setOpenPopup: React.Dispatch<React.SetStateAction<string>>;
  setPopupMessage: React.Dispatch<React.SetStateAction<null | IMessage>>;
  setCloseBtnChangeMsg: React.Dispatch<React.SetStateAction<boolean>>;
  setCloseBtnReplyMsg: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  channels: string[];
  directMessages: string[];
}

const Message = memo(
  ({
    message,
    openPopup,
    setOpenPopup,
    setPopupMessage,
    setCloseBtnChangeMsg,
    setCloseBtnReplyMsg,
  }: IProps) => {
    const { text, createdAt, updatedAt, status, id, senderId, replyOn } =
      message;
    const { t } = useTranslation();
    const theme = useTheme();
    const { data: users, loading } = useQuery(GET_USERS);

    const style: { root: React.CSSProperties } = {
      root: {
        cursor: "pointer",
        position: "relative",
        backgroundColor: openPopup === id ? theme.palette.primary.dark : "none",
      },
    };

    const senderName = useMemo(() => {
      return users.users.find((user: IUser) => {
        return user.id === senderId;
      }).name;
    }, [users]);

    const classMessage = replyOn ? "container-reply" : "container";
    const replyMessage = replyOn ? (
      <div className={`${classMessage}__reply`}>
        <p
          style={{
            fontWeight: 600,
            color: theme.palette.primary.contrastText,
            margin: "15px 0px 20px 0px",
          }}
        >
          {senderName}
        </p>
        <p style={{ margin: "0px 0px 10px 0px" }}>{replyOn}</p>
      </div>
    ) : null;

    const handleClick = () => {
      setOpenPopup((prevState: string) => (prevState === id ? "" : id));
      setCloseBtnChangeMsg(false);
      setCloseBtnReplyMsg(false);
      setPopupMessage(message);
    };

    if (loading) return <Loader />;

    return (
      <Box data-testid="main-message-div" style={style.root}>
        <Box className={classMessage} id={id} onClick={handleClick}>
          <img
            src={imageProfile}
            className={`${classMessage}__icon`}
            style={{
              borderRadius: 0,
              height: 40,
              width: 40,
            }}
          />
          <p
            style={{ color: theme.palette.primary.contrastText }}
            className={`${classMessage}__messager`}
          >
            {senderName}
          </p>
          <p className={`${classMessage}__date`}>
            {messageDate(parseInt(createdAt))}
          </p>
          {/* Відправлено, доставлено, прочитано */}
          {status === "delivered" ? (
            <DoneIcon
              className={`${classMessage}__status`}
              style={{ color: theme.palette.primary.contrastText }}
            />
          ) : (
            <AccessTimeIcon className={`${classMessage}__status`} />
          )}
          <p
            style={{
              display: updatedAt && updatedAt !== createdAt ? "block" : "none",
              fontSize: 11,
            }}
            className={`${classMessage}__info`}
          >
            {`${t("description.editedMessage")}: ${messageDate(
              parseInt(updatedAt) || parseInt(createdAt)
            )}`}
          </p>
          <p
            style={{ maxWidth: "fit-content" }}
            className={`${classMessage}__message`}
          >
            {text}
          </p>
          {replyMessage}
        </Box>
      </Box>
    );
  }
);

export default Message;
