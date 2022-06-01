export default interface IChannel {
  id: string;
  name: string;
  admin: string;
  description: string;
  members: string[];
  isPrivate: boolean;
}
