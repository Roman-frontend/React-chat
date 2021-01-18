import React from 'react';
import { Channels } from './Channels/Channels.jsx';
import { DirectMessages } from './DirectMessages/DirectMessages.jsx';
import './user-sets.sass';

export default function SetsUser(props) {
  return (
    <div className='main-font left-block'>
      <Channels />
      <DirectMessages />
    </div>
  );
}
