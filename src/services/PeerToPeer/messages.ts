import { IPlayer } from "../Store/IPlayer";

export type IRequestData = IUpdatePlayer | IStartGame;

interface IUpdatePlayer {
  command: "UPDATE_PLAYER";
  data: Partial<IPlayer>;
}

interface IStartGame {
  command: "START_GAME";
  gameId: number;
}
