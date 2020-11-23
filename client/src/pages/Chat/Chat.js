import React from "react";
import Header from "../../components/Header/Header.jsx";
import { SetsUser } from "../../components/SetsUser/SetsUser.jsx";
import Conversation from "../../components/Conversation/Conversation.jsx";
import "./chat-page.sass";

export const Chat = () => {
  //як аргументо WebSocket приймає url але замість http WebSocket використовують ws
  const socket = new WebSocket("ws://localhost:8080");

  return (
    <div className="chat-page">
      <Header />
      <SetsUser socket={socket} />
      <Conversation socket={socket} />
    </div>
  );
};
