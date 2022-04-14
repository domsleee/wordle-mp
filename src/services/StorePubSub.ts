import { Subject, Subscription } from "rxjs";
import { GlobalServices } from "./GlobalServices";
import { IPlayer } from "./Store/IPlayer";
import { GameModule } from "./Store/modules/Game";
import { store } from "./Store/Store";

export class StorePubSub {
  subs?: Subscription;
  startGame = new Subject<number>();

  attach() {
    this.subs = GlobalServices.PeerToPeer.getMessageObservable().subscribe(
      (msg) => {
        if (msg.data.command === "UPDATE_PLAYER") {
          GameModule.processPlayer(msg.data.data);
        } else if (msg.data.command === "START_GAME") {
          this.startGame.next(msg.data.gameId);
        } else if (msg.data.command === "DISCONNECTED") {
          GameModule.removePlayer(msg.data.name);
        }
      }
    );
  }

  detach() {
    this.subs?.unsubscribe();
  }

  publishMyPlayer(player: IPlayer) {
    GlobalServices.PeerToPeer.broadcast({
      command: "UPDATE_PLAYER",
      data: this.getPartialPlayer(player),
    });
  }

  getPartialPlayer(player: IPlayer): Partial<IPlayer> {
    return {
      id: player.id,
      name: player.name,
      numGuesses: player.numGuesses,
      hp: player.hp,
      isGameOver: player.isGameOver,
    };
  }

  sendUserAllData(id: string) {
    for (const player of GameModule.players) {
      if (player.id !== id) {
        GlobalServices.PeerToPeer.sendSingleMessage(id, {
          command: "UPDATE_PLAYER",
          data: this.getPartialPlayer(player),
        });
      }
    }
  }
}
