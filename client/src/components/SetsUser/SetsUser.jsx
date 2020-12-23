import React from 'react';
import { Channels } from './Channels/Channels.jsx';
import { DirectMessages } from './DirectMessages/DirectMessages';
import './user-sets.sass';

export default function SetsUser(props) {
  const { socket } = props;

  return (
    <div className='main-font left-block'>
      <Channels socket={socket} />
      <DirectMessages socket={socket} />
    </div>
  );
}
