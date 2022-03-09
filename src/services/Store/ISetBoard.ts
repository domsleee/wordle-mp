import { PatternType } from "../GameClient/utils";
import { IPlayer } from "./IPlayer";

export interface ISetBoard {
  player: IPlayer;
  row: number;
  col: number;
  char: string;
}

export interface IApplyBackspace {
  player: IPlayer;
  row: number;
  col: number;
}

export interface IApplyPattern {
  player: IPlayer;
  row: number;
  pattern: PatternType;
  guess: string;
}

export interface IChangeName {
  player: IPlayer;
  name: string;
}
