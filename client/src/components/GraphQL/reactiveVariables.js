import { makeVar } from '@apollo/client';

const storage = JSON.parse(sessionStorage.getItem('storageData'));
export const reactiveVarToken = storage ? makeVar(storage.token) : makeVar();
export const reactiveVarName = storage ? makeVar(storage.name) : makeVar();
export const reactiveVarEmail = storage ? makeVar(storage.email) : makeVar();
export const reactiveVarId = storage ? makeVar(storage.id) : makeVar();
export const reactiveDirectMessages = storage
  ? makeVar(storage.directMessages)
  : makeVar();
export const reactiveVarChannels = storage
  ? makeVar(storage.channels)
  : makeVar();
export const authReactiveVar = makeVar(storage);
export const reactiveActiveChannelId = makeVar();
export const reactiveActiveDirrectMessageId = makeVar();
export const reactiveOnlineMembers = makeVar([]);
