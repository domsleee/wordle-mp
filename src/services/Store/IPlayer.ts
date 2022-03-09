import { BoardType, PatternChar } from "../GameClient/utils";

export interface IPlayer {
  id: string;
  name: string;
  hp: number;
  numGuesses: number;
  locked: boolean;
  boardState: BoardType;
  patternBoard: BoardType;
  letterToPattern: Array<PatternChar | "">;
}
