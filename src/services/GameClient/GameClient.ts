import { mutations, store } from "../Store/Store";
import { KeyboardEventsService } from "../KeyboardEventsService";
import { GlobalServices } from "../GlobalServices";
import { IPlayer } from "../Store/IPlayer";
import { getLogger } from "loglevel";
import { PatternType } from "./utils";
import { PatternGetter } from "./PatternGetter";
import { Subject, Subscription } from "rxjs";
import { dictionary } from "./Dictionary";
import { StorePubSub } from "../StorePubSub";
import router from "@/router";

const logger = getLogger("game-client");

export default class GameClient {
  patternGetter!: PatternGetter;
  readonly subs: Subscription[];
  readonly invalidGuess = new Subject<void>();
  readonly keyEntered = new Subject<{ row: number; col: number }>();

  constructor() {
    GlobalServices.KeyboardEvents.detachListeners();
    GlobalServices.KeyboardEvents.attachListeners();
    this.subs = [
      GlobalServices.KeyboardEvents.keydownFirstTime.subscribe((t) =>
        this.onKeyPress(t)
      ),
      GlobalServices.StorePubSub.startGame.subscribe(() => {
        router.push("/game");
      }),
    ];
  }

  onKeyPress(key: string) {
    if (!store.state.isInGame) return;
    if ("a" <= key && key <= "z") {
      this.tryApplyKey(key);
    } else if (key == "Enter") {
      this.tryEnter();
    } else if (key == "Backspace") {
      this.tryBackspace();
    }
  }

  destroy() {
    GlobalServices.KeyboardEvents.detachListeners();
    this.subs.forEach((t) => t.unsubscribe());
  }

  startGame(patternGetter: PatternGetter) {
    mutations.setIsInGame(true);
    this.patternGetter = patternGetter;
  }

  getMyPlayer(): IPlayer | null {
    const players = store.state.players.filter(
      (t) => t.id == GlobalServices.PeerToPeer.getId()
    );
    return players.length > 0 ? players[0] : null;
  }

  getRowNumber(): number | null {
    const player = this.getMyPlayer();
    if (player == null) return null;
    if (player.numGuesses >= player.boardState.length) return null;

    return player.numGuesses;
  }

  private tryApplyKey(char: string) {
    const player = this.getMyPlayer();
    if (player == null) return;
    if (player.locked) return;

    const rowNumber = this.getRowNumber();
    if (rowNumber == null) return;

    const row = player.boardState[rowNumber];

    let c = 0;
    for (c = 0; c < row.length; ++c) {
      if (row[c] == "") break;
    }

    if (c >= row.length) return;

    this.keyEntered.next({ row: rowNumber, col: c });
    mutations.setBoard({
      player: player,
      row: rowNumber,
      col: c,
      char,
    });
  }

  private tryEnter() {
    const player = this.getMyPlayer();
    if (player == null) return null;

    const rowNumber = this.getRowNumber();
    if (rowNumber == null) return null;

    const row = player.boardState[rowNumber];
    if (row[row.length - 1] == "") return null;

    const word = row.join("");
    if (!dictionary.guesses.includes(word)) {
      this.invalidGuess.next();
      return null;
    }
    const guess = row.join("");
    const pattern = this.patternGetter.evaluate(guess);
    this.applyPattern(guess, pattern);
  }

  private applyPattern(guess: string, pattern: PatternType) {
    mutations.applyPattern({
      player: this.getMyPlayer()!,
      row: this.getRowNumber()!,
      pattern,
      guess,
    });
  }

  private tryBackspace() {
    const player = this.getMyPlayer();
    if (player == null) return null;

    const rowNumber = this.getRowNumber();
    if (rowNumber == null) return null;

    const row = player.boardState[rowNumber];
    if (row[0] === "") return null;

    let c = 0;
    for (c = 0; c < row.length; ++c) {
      if (row[c] == "") break;
    }
    c--;

    mutations.applyBackspace({
      player,
      row: rowNumber,
      col: c,
    });
  }
}
