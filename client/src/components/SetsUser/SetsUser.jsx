import React from 'react';
import { Channels } from './Channels/Channels.jsx';
import { DirectMessages } from './DirectMessages/DirectMessages.jsx';
import { colors } from '@material-ui/core';
import './user-sets.sass';

export default function SetsUser(props) {
  const { resSuspense } = props;

  return (
    <div
      className='main-font left-block'
      style={{ background: colors.blue[900] }}
    >
      <Channels resSuspense={resSuspense} />
      <DirectMessages resSuspense={resSuspense} />
    </div>
  );
}
