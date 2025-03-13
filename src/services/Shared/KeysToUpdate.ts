import { IPlayer } from "../Store/IPlayer";

export const playerKeysToUpdate: Array<keyof IPlayer> = [
  "name",
  "hp",
  "score",
  "isGameOver",
  "isInGame",
  "numGuesses",
  //"boardState",
  //"patternBoard",
  "currentRoute",
  "gameId",
];
