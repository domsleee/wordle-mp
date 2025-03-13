import { Routes } from "@/router";
import { IScoreConfig } from "@/services/GameClient/IScoreConfig";
import { A_CHAR_CODE } from "@/services/GameClient/PatternGetter";
import {
  createEmptyPlayer,
  getDefaultScoreConfig,
  getMaxPatternChar,
  getPlayerById,
} from "@/services/GameClient/utils";
import { GlobalServices } from "@/services/GlobalServices";
import { playerKeysToUpdate } from "@/services/Shared/KeysToUpdate";
import ModelUpdater from "@/services/Shared/ModelUpdater";
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
  gameId: number;
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
  public gameId = 0;

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
      GameModule.addPlayer({ ...createEmptyPlayer(id), ...partialPlayer });
      return;
    }

    const m = new ModelUpdater();
    m.updatePlayer(player, partialPlayer);
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
    const player = getPlayerById(this, data.player.id)!;
    player.hp += data.hpToAdd;
    player.score += data.hpToAdd;
    publishPlayer(player);
  }

  @Mutation
  clearBoard(player: IPlayer) {
    const p = createEmptyPlayer("dummy");
    player.boardState = p.boardState;
    player.patternBoard = p.patternBoard;
    player.numGuesses = p.numGuesses;
    player.letterToPattern = p.letterToPattern;
    publishPlayer(player);
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

  @Mutation
  setPlayerRoute(data: { player: IPlayer; route: Routes }) {
    const player = getPlayerById(this, data.player.id)!;
    player.currentRoute = data.route;
    publishPlayer(player);
  }

  @Mutation
  setCurrentPlayer(data: { player: Partial<IPlayer> }) {
    const myPlayer = GlobalServices.GameClient?.getMyPlayer();
    if (myPlayer) {
      const player = getPlayerById(this, myPlayer.id)!;
      Object.assign(player, data.player);
      publishPlayer(player);
    }
  }

  @Mutation
  getAndIncrementGameId() {
    return this.gameId++;
  }

  @Mutation
  removePlayer(playerId: string) {
    this.players = this.players.filter((t) => t.id !== playerId);
  }
}

function getInitialState(): IGameState {
  return {
    count: 0,
    isInGame: false,
    players: [],
    seed: "1234",
    scoreConfig: getDefaultScoreConfig(),
    gameId: 0,
  };
}

function publishPlayer(player: IPlayer) {
  GlobalServices.StorePubSub.publishMyPlayer(player);
}

function sendUserAllData(id: string) {
  GlobalServices.StorePubSub.sendUserAllData(id);
}

export const GameModule = getModule(Game);
