import { BoardType, PatternChar } from "../GameClient/utils";

export interface IPlayer {
  id: string;
  name: string;
  hp: number;
  score: number;
  isGameOver: boolean;
  numGuesses: number;
  boardState: BoardType;
  patternBoard: BoardType;
  letterToPattern: Array<PatternChar | "">;
}
