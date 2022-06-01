export default interface IMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  replyOn: string;
  chatType: string;
  chatId: string;
}
