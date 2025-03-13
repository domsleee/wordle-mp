import { Routes } from "@/router";
import { IPlayer } from "../Store/IPlayer";
import { GameModule, IGameState } from "../Store/modules/Game";
import { IScoreConfig } from "./IScoreConfig";

export type BoardType = Array<Array<string>>;
export function getEmptyBoardState(
  numLetters: number,
  numGuesses: number
): BoardType {
  const b: BoardType = Array<Array<string>>(numGuesses);
  for (let i = 0; i < numGuesses; ++i) {
    b[i] = Array<string>(numLetters).fill("");
  }
  return b;
}

export function getBoardArray(b: BoardType) {
  const ret = new Array<Array<boolean>>(b.length);
  for (let i = 0; i < b.length; ++i) {
    ret[i] = new Array<boolean>(b[i].length).fill(false);
  }
  return ret;
}

export function getPlayerById(state: IGameState, id: string) {
  const players = state.players.filter((t: IPlayer) => t.id === id);
  return players.length === 1 ? players[0] : null;
}

export function createEmptyPlayer(id: string, name = "Guest"): IPlayer {
  return {
    name,
    id,
    currentRoute: Routes.LOBBY,
    gameId: 0,
    ...createResettablePlayer(),
  };
}

export function createResettablePlayer() {
  return {
    numGuesses: 0,
    score: 0,
    isGameOver: false,
    isInGame: false,
    boardState: getEmptyBoardState(5, 6),
    patternBoard: getEmptyBoardState(5, 6),
    hp: GameModule.scoreConfig.startingHp,
    letterToPattern: new Array<PatternChar | "">(27).fill(""),
  };
}

export function getMaxPatternChar(
  p1: PatternCharOrBlank,
  p2: PatternCharOrBlank
): PatternCharOrBlank {
  return patternCharToInt(p1) > patternCharToInt(p2) ? p1 : p2;
}

export function patternCharToInt(p1: PatternCharOrBlank) {
  switch (p1) {
    case "":
      return 0;
    case "_":
      return 1;
    case "?":
      return 2;
    case "+":
      return 3;
  }
}

export function charToClass(char: PatternCharOrBlank) {
  switch (char) {
    case "?":
      return "wrongSpot orange";
    case "+":
      return "correct green";
    case "_":
      return "incorrect grey darken-2";
    default:
      return "";
  }
}

export type PatternChar = "?" | "+" | "_";
export type PatternCharOrBlank = PatternChar | "";

export type PatternType = Array<PatternCharOrBlank>;

export function getDefaultScoreConfig(): IScoreConfig {
  return {
    hpForCorrectWord: 20,
    hpForGreen: 2,
    hpForYellow: 1,
    hpForIncorrectWord: 20,
    startingHp: 70,
  };
}

export function isCorrectPattern(pattern: PatternType) {
  return pattern.filter((t) => t !== "+").length === 0;
}
