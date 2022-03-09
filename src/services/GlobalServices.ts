import GameHost from "./GameHost";
import GameClient from "./GameClient/GameClient";
import { PeerToPeerService } from "./PeerToPeer/PeerToPeerService";
import { KeyboardEventsService } from "./KeyboardEventsService";
import { StorePubSub } from "./StorePubSub";

export const GlobalServices = {
  PeerToPeer: new PeerToPeerService(),
  StorePubSub: new StorePubSub(),
  KeyboardEvents: new KeyboardEventsService(),
  GameClient: null as any as GameClient | null,
  GameHost: null as any as GameHost | null,
  registerGameHost() {
    GlobalServices.GameHost = new GameHost();
  },
  registerGameClient() {
    GlobalServices.GameClient = new GameClient();
    GlobalServices.StorePubSub.attach();
  },
};
