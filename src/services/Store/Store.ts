import {
  INotificationType,
  MyNotification,
  StoredNotification,
} from "./INotificationType";
import Vuex from "vuex";
import Vue from "vue";
import { IPlayer } from "./IPlayer";
import {
  IApplyBackspace,
  IApplyPattern,
  IChangeName,
  ISetBoard,
} from "./ISetBoard";
import {
  createEmptyPlayer,
  getDefaultScoreConfig,
  getMaxPatternChar,
  getPlayerById,
  PatternType,
} from "../GameClient/utils";
import { apply } from "loglevel-plugin-prefix";
import { A_CHAR_CODE } from "../GameClient/PatternGetter";
import { GlobalServices } from "../GlobalServices";
import { IScoreConfig } from "../GameClient/IScoreConfig";

// declare your own store states
export interface State {
  count: number;
  notifications: Array<StoredNotification>;
  isInGame: boolean;
  players: Array<IPlayer>;
  seed: string;
  scoreConfig: IScoreConfig;
}
Vue.use(Vuex);

function getInitialState() {
  return {
    count: 0,
    notifications: [],
    isInGame: false,
    players: [],
    seed: "1234",
    scoreConfig: getDefaultScoreConfig(),
  };
}

// Create a new store instance.
export const store = new Vuex.Store({
  state(): State {
    return getInitialState();
  },
  mutations: {
    raiseNotification(state: State, notification: MyNotification) {
      state.notifications.push({
        ...notification,
        isHidden: false,
        id: state.notifications.length,
      });
    },
    isInGame(state: State, isInGame: boolean) {
      state.isInGame = isInGame;
    },
    addPlayer(state: State, player: IPlayer) {
      state.players.push(player);
      if (player.id === GlobalServices.PeerToPeer.getId()) {
        publishPlayer(player);
      }
      if (GlobalServices.PeerToPeer.getIsHost()) {
        sendUserAllData(player.id);
      }
    },
    setBoard(state: State, setBoard: ISetBoard) {
      const player = getPlayerById(state, setBoard.player.id);
      if (player != null) {
        Vue.set(player.boardState[setBoard.row], setBoard.col, setBoard.char);
      }
    },
    applyPattern(state: State, applyPattern: IApplyPattern) {
      const player = getPlayerById(state, applyPattern.player.id);
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
    },
    applyBackspace(state: State, applyBackspace: IApplyBackspace) {
      const player = getPlayerById(state, applyBackspace.player.id);
      if (player != null) {
        Vue.set(player.boardState[applyBackspace.row], applyBackspace.col, "");
      }
    },
    changeName(state: State, changeName: IChangeName) {
      const player = getPlayerById(state, changeName.player.id);
      if (player != null) {
        player.name = changeName.name;
        publishPlayer(changeName.player);
      }
    },
    hideNotification(state: State, notification: StoredNotification) {
      state.notifications[notification.id].isHidden = true;
    },
    processPlayer(state: State, partialPlayer: Partial<IPlayer>) {
      const id = partialPlayer.id!;
      const player = getPlayerById(state, id);
      if (player == null) {
        mutations.addPlayer({ ...createEmptyPlayer(id), ...partialPlayer });
        return;
      }
      if (partialPlayer.name) player.name = partialPlayer.name;
      if (partialPlayer.hp) player.hp = partialPlayer.hp;
      if ("numGuesses" in partialPlayer)
        player.numGuesses = partialPlayer.numGuesses!;
    },
    reset(state: State) {
      const { notifications, ...rest } = getInitialState();
      Object.assign(state, rest);
    },
    deductHpForAllPlayers(state: State, player: IPlayer) {
      for (const p of state.players) {
        p.hp = Math.max(0, p.hp - 1);
      }
    },
    addHp(state: State, command: { player: IPlayer; hpToAdd: number }) {
      const player = getPlayerById(state, command.player.id);
      player!.hp += command.hpToAdd;
      player!.score += command.hpToAdd;
      console.log(player);
    },
    clearBoard(state: State, player: IPlayer) {
      const p = createEmptyPlayer("dummy");
      player.boardState = p.boardState;
      player.patternBoard = p.patternBoard;
      player.numGuesses = p.numGuesses;
      player.letterToPattern = p.letterToPattern;
    },
    gameOver(state: State, player: IPlayer) {
      player.isGameOver = true;
      publishPlayer(player);
    },
  },
  getters: {
    sortedPlayers: (state) => {
      return state.players.sort((a, b) => {
        if (a.score !== b.score) {
          return b.score - a.score;
        }

        return a.name < b.name ? -1 : 1;
      });
    },
  },
});

function publishPlayer(player: IPlayer) {
  GlobalServices.StorePubSub.publishMyPlayer(player);
}

function sendUserAllData(id: string) {
  GlobalServices.StorePubSub.sendUserAllData(id);
}

export const mutations = {
  raiseNotification(notification: MyNotification) {
    setTimeout(() => {
      store.commit("raiseNotification", notification);
    }, 100);
  },
  setIsInGame(isInGame: boolean) {
    store.commit("isInGame", isInGame);
  },
  addPlayer(player: IPlayer) {
    store.commit("addPlayer", player);
  },
  setBoard(setBoard: ISetBoard) {
    store.commit("setBoard", setBoard);
  },
  applyPattern(applyPattern: IApplyPattern) {
    store.commit("applyPattern", applyPattern);
  },
  changeName(changeName: IChangeName) {
    store.commit("changeName", changeName);
  },
  applyBackspace(applyBackspace: IApplyBackspace) {
    store.commit("applyBackspace", applyBackspace);
  },
  processPlayer(partialPlayer: Partial<IPlayer>) {
    store.commit("processPlayer", partialPlayer);
  },
  hideNotification(notification: StoredNotification) {
    store.commit("hideNotification", notification);
  },
  reset() {
    store.commit("reset");
  },
  deductHpForAllPlayers() {
    store.commit("deductHpForAllPlayers");
  },
  addHp(player: IPlayer, hpToAdd: number) {
    store.commit("addHp", { player, hpToAdd });
  },
  clearBoard(player: IPlayer) {
    store.commit("clearBoard", player);
  },
  gameOver(player: IPlayer) {
    store.commit("gameOver", player);
  },
};
