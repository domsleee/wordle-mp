import { IRequestData } from "./messages";

export type MessageData = IDisconnect | IRequestData;

export type IMessage = IGenericMessage<MessageData>;

export interface IGenericMessage<T> {
  type: "BROADCAST" | "SINGLE";
  from: string;
  data: T;
  echoBroadcast?: boolean;
}

interface IDisconnect {
  command: "DISCONNECTED";
  name: string;
}
