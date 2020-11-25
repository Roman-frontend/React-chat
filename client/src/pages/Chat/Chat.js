import React from "react";
import Header from "../../components/Header/Header.jsx";
import { SetsUser } from "../../components/SetsUser/SetsUser.jsx";
import Conversation from "../../components/Conversation/Conversation.jsx";
import "./chat-page.sass";

export const Chat = () => {
  //як аргументо WebSocket приймає url але замість http WebSocket використовують ws
  const socket = new WebSocket("ws://localhost:8080");

  //Cteating timeout when socket is connecting
  const waitForOpenConnection = (socket) => {
    return new Promise((resolve, reject) => {
      const maxNumberOfAttempts = 10;
      const intervalTime = 200; //ms

      let currentAttempt = 0;
      const interval = setInterval(() => {
        if (currentAttempt > maxNumberOfAttempts - 1) {
          clearInterval(interval);
          reject(new Error("Maximum number of attempts exceeded"));
        } else if (socket.readyState === socket.OPEN) {
          clearInterval(interval);
          resolve();
        }
        currentAttempt++;
      }, intervalTime);
    });
  };

  const sendMessage = async (socket, msg) => {
    if (socket.readyState !== socket.OPEN) {
      try {
        await waitForOpenConnection(socket);
        socket.send(msg);
      } catch (err) {
        console.error(err);
      }
    } else {
      socket.send(msg);
    }
  };

  return (
    <div className="chat-page">
      <Header />
      <SetsUser socket={socket} />
      <Conversation socket={socket} sendMessage={sendMessage} />
    </div>
  );
};
