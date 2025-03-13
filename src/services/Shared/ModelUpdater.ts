import Vue from "vue";
import { BoardType } from "../GameClient/utils";
import { IPlayer } from "../Store/IPlayer";
import { playerKeysToUpdate } from "./KeysToUpdate";

export default class ModelUpdater {
  updatePlayer(player: IPlayer, partialPlayer: Partial<IPlayer>) {
    for (const key of playerKeysToUpdate) {
      if (key in partialPlayer) {
        // @ts-ignore
        player[key] = partialPlayer[key];
      }
    }

    this.updatePlayerBoardState(player, partialPlayer, "patternBoard");
  }

  private updatePlayerBoardState(
    player: IPlayer,
    partialPlayer: Partial<IPlayer>,
    boardKey: keyof IPlayer
  ) {
    if (!(boardKey in partialPlayer)) {
      return;
    }

    const board1 = player[boardKey] as BoardType;
    const board2 = partialPlayer[boardKey] as BoardType;

    for (let r = 0; r < board1.length; ++r) {
      for (let c = 0; c < board1[r].length; ++c) {
        if (board1[r][c] !== board2[r][c]) {
          Vue.set(board1[r], c, board2[r][c]);
        }
      }
    }
  }
}
