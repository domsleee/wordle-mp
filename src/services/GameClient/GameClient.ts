import { store } from "../Store/Store";
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
import { GameModule } from "../Store/modules/Game";

const logger = getLogger("game-client");
const NUM_GUESSES = 6;

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
    if (!GameModule.isInGame) return;
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
    GameModule.setIsInGame(true);
    this.patternGetter = patternGetter;
  }

  tick() {
    GameModule.deductHpForAllPlayers();
    const player = this.getMyPlayer()!;
    if (player.hp === 0) {
      GameModule.gameOver(player);
    }
  }

  getMyPlayer(): IPlayer | null {
    const players = GameModule.players.filter(
      (t: IPlayer) => t.id == GlobalServices.PeerToPeer.getId()
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
    if (player == null || player.isGameOver) return;

    const rowNumber = this.getRowNumber();
    if (rowNumber == null) return;

    const row = player.boardState[rowNumber];

    let c = 0;
    for (c = 0; c < row.length; ++c) {
      if (row[c] == "") break;
    }

    if (c >= row.length) return;

    this.keyEntered.next({ row: rowNumber, col: c });
    GameModule.setBoard({
      player: player,
      row: rowNumber,
      col: c,
      char,
    });
  }

  private tryEnter() {
    const player = this.getMyPlayer();
    if (player == null || player.isGameOver) return null;

    const rowNumber = this.getRowNumber();
    if (rowNumber == null) return null;

    const row = player.boardState[rowNumber];
    if (row[row.length - 1] == "") return null;

    const word = row.join("");
    if (!dictionary.guesses.includes(word.toLowerCase())) {
      this.invalidGuess.next();
      return null;
    }
    const guess = row.join("");
    const pattern = this.patternGetter.evaluate(guess);
    this.applyPattern(player, guess, pattern);
  }

  applyPattern(player: IPlayer, guess: string, pattern: PatternType) {
    GameModule.applyPattern({
      player,
      row: this.getRowNumber()!,
      pattern,
      guess,
    });

    const isCorrectPattern = (pattern: PatternType) =>
      pattern.filter((t) => t !== "+").length === 0;

    if (isCorrectPattern(pattern)) {
      GameModule.addHp(player, GameModule.scoreConfig.hpForCorrectWord);
      return this.gotoNextWord(player);
    }

    let extraHp = 0;
    for (const ch of pattern) {
      if (ch === "+") extraHp += GameModule.scoreConfig.hpForGreen;
      if (ch === "?") extraHp += GameModule.scoreConfig.hpForYellow;
    }
    GameModule.addHp(player, extraHp);

    if (this.getRowNumber() == NUM_GUESSES - 1) {
      GameModule.addHp(player, -GameModule.scoreConfig.hpForIncorrectWord);
      return this.gotoNextWord(player);
    }
  }

  private gotoNextWord(player: IPlayer) {
    GameModule.clearBoard(player);
    this.patternGetter.getNextWord();
  }

  private tryBackspace() {
    const player = this.getMyPlayer();
    if (player == null || player.isGameOver) return null;

    const rowNumber = this.getRowNumber();
    if (rowNumber == null) return null;

    const row = player.boardState[rowNumber];
    if (row[0] === "") return null;

    let c = 0;
    for (c = 0; c < row.length; ++c) {
      if (row[c] == "") break;
    }
    c--;

    GameModule.applyBackspace({
      player,
      row: rowNumber,
      col: c,
    });
  }
}
