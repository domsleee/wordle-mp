import { Routes } from "@/router";
import { BoardType, PatternChar } from "../GameClient/utils";

export interface IPlayer {
  id: string;
  name: string;
  currentRoute: Routes;

  hp: number;
  score: number;
  isGameOver: boolean;
  isInGame: boolean;
  numGuesses: number;
  boardState: BoardType;
  patternBoard: BoardType;
  letterToPattern: Array<PatternChar | "">;
  gameId: number;
}
