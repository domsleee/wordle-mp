import { IScoreConfig } from "@/services/GameClient/IScoreConfig";
import { A_CHAR_CODE } from "@/services/GameClient/PatternGetter";
import {
  createEmptyPlayer,
  getDefaultScoreConfig,
  getMaxPatternChar,
  getPlayerById,
} from "@/services/GameClient/utils";
import { GlobalServices } from "@/services/GlobalServices";
import Vue from "vue";
import {
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import { IPlayer } from "../IPlayer";
import {
  IApplyBackspace,
  IApplyPattern,
  IChangeName,
  ISetBoard,
} from "../ISetBoard";
import { store } from "../Store";

export interface IGameState {
  count: number;
  isInGame: boolean;
  players: Array<IPlayer>;
  seed: string;
  scoreConfig: IScoreConfig;
}

@Module({
  name: "Game",
  dynamic: true,
  store,
})
class Game extends VuexModule implements IGameState {
  public isInGame!: boolean;
  public count!: number;
  public players!: Array<IPlayer>;
  public seed!: string;
  public scoreConfig!: IScoreConfig;

  constructor(module: any) {
    super(module);
    this.reset();
  }

  get sortedPlayers() {
    return this.players.sort((a: IPlayer, b: IPlayer) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }

      return a.name < b.name ? -1 : 1;
    });
  }

  @Mutation
  setIsInGame(isInGame: boolean) {
    this.isInGame = isInGame;
  }

  @Mutation
  addPlayer(player: IPlayer) {
    this.players.push(player);
    if (player.id === GlobalServices.PeerToPeer.getId()) {
      publishPlayer(player);
    }
    if (GlobalServices.PeerToPeer.getIsHost()) {
      sendUserAllData(player.id);
    }
  }

  @Mutation
  setBoard(setBoard: ISetBoard) {
    const player = getPlayerById(this, setBoard.player.id);
    if (player != null) {
      Vue.set(player.boardState[setBoard.row], setBoard.col, setBoard.char);
    }
  }

  @Mutation
  applyPattern(applyPattern: IApplyPattern) {
    const player = getPlayerById(this, applyPattern.player.id);
    if (player != null) {
      Vue.set(player.patternBoard, applyPattern.row, applyPattern.pattern);
      for (let i = 0; i < applyPattern.guess.length; ++i) {
        const ch = applyPattern.guess[i];
        const patternChar = applyPattern.pattern[i];
        const chIndex = ch.charCodeAt(0) - A_CHAR_CODE;
        Vue.set(
          player.letterToPattern,
          chIndex,
          getMaxPatternChar(player.letterToPattern[chIndex], patternChar)
        );
      }

      player.numGuesses += 1;
      publishPlayer(applyPattern.player);
    }
  }

  @Mutation
  applyBackspace(applyBackspace: IApplyBackspace) {
    const player = getPlayerById(this, applyBackspace.player.id);
    if (player != null) {
      Vue.set(player.boardState[applyBackspace.row], applyBackspace.col, "");
    }
  }

  @Mutation
  changeName(changeName: IChangeName) {
    const player = getPlayerById(this, changeName.player.id);
    if (player != null) {
      player.name = changeName.name;
      publishPlayer(changeName.player);
    }
  }

  @Mutation
  processPlayer(partialPlayer: Partial<IPlayer>) {
    const id = partialPlayer.id!;
    const player = getPlayerById(this, id);
    if (player == null) {
      this.addPlayer({ ...createEmptyPlayer(id), ...partialPlayer });
      return;
    }
    if (partialPlayer.name) player.name = partialPlayer.name;
    if (partialPlayer.hp) player.hp = partialPlayer.hp;
    if ("numGuesses" in partialPlayer)
      player.numGuesses = partialPlayer.numGuesses!;
  }

  @Mutation
  reset() {
    Object.assign(this, getInitialState());
    console.log(this);
  }

  @Mutation
  deductHpForAllPlayers() {
    for (const p of this.players) {
      p.hp = Math.max(0, p.hp - 1);
    }
  }

  @Mutation
  addHp(data: { player: IPlayer; hpToAdd: number }) {
    const player = getPlayerById(this, data.player.id);
    console.log("hp to add", data.hpToAdd);
    player!.hp += data.hpToAdd;
    player!.score += data.hpToAdd;
    console.log(player);
  }

  @Mutation
  clearBoard(player: IPlayer) {
    const p = createEmptyPlayer("dummy");
    player.boardState = p.boardState;
    player.patternBoard = p.patternBoard;
    player.numGuesses = p.numGuesses;
    player.letterToPattern = p.letterToPattern;
  }

  @Mutation
  gameOver(thePlayer: IPlayer) {
    const player = getPlayerById(this, thePlayer.id)!;
    player.isGameOver = true;
    publishPlayer(player);
  }

  @Mutation
  setPlayerIsInGame(data: { player: IPlayer; isInGame: boolean }) {
    const player = getPlayerById(this, data.player.id)!;
    player.isInGame = data.isInGame;
    publishPlayer(player);
  }
}

function getInitialState(): IGameState {
  return {
    count: 0,
    isInGame: false,
    players: [],
    seed: "1234",
    scoreConfig: getDefaultScoreConfig(),
  };
}

function publishPlayer(player: IPlayer) {
  GlobalServices.StorePubSub.publishMyPlayer(player);
}

function sendUserAllData(id: string) {
  GlobalServices.StorePubSub.sendUserAllData(id);
}

export const GameModule = getModule(Game);
