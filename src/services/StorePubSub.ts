import { Subject, Subscription } from "rxjs";
import { GlobalServices } from "./GlobalServices";
import { IPlayer } from "./Store/IPlayer";
import { mutations, store } from "./Store/Store";

export class StorePubSub {
  subs?: Subscription;
  startGame = new Subject<void>();

  attach() {
    this.subs = GlobalServices.PeerToPeer.getMessageObservable().subscribe(
      (msg) => {
        if (msg.data.command === "UPDATE_PLAYER") {
          mutations.processPlayer(msg.data.data);
        } else if (msg.data.command === "START_GAME") {
          this.startGame.next();
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
    };
  }

  sendUserAllData(id: string) {
    for (const player of store.state.players) {
      if (player.id !== id) {
        GlobalServices.PeerToPeer.sendSingleMessage(id, {
          command: "UPDATE_PLAYER",
          data: this.getPartialPlayer(player),
        });
      }
    }
  }
}
