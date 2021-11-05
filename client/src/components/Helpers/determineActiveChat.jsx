export function determineActiveChat(directMessage, users, authId) {
  if (directMessage.members[0] === authId) {
    return users.find((user) => {
      return user.id === directMessage.members[1];
    }).name;
  }
  return users.find((user) => {
    return user.id === directMessage.members[0];
  }).name;
}
