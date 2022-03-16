<template>
  <v-container :style="'--hp-color: ' + hpColor">
    <GameOverDialog :isVisible="player.isGameOver"></GameOverDialog>
    <v-row style="column-gap: 50px">
      <v-col class="mobile-players">
        <MobileHealthBars
          :players="sortedPlayers"
          :partialSecond="partialSecond"
        />
      </v-col>
      <v-col class="board main-board-col">
        <div class="main-board-container" style="margin-top: 86px">
          <div style="display: flex; width: 100%">
            <div
              style="justify-self: left"
              :class="{ 'red--text': player.isGameOver }"
            >
              {{ player.name }}
            </div>
            <div style="justify-self: right; text-align: right; flex-grow: 1">
              {{ player.hp }}s
            </div>
          </div>

          <v-progress-linear
            class="myprogress"
            :color="getHpColor(player.hp)"
            :background-color="getHpBackgroundColor(player.hp)"
            :value="getHpValue(player.hp)"
            :class="{
              'animation-disabled': getHpShouldAnimationBeDisabled(player.hp),
              'red--text': player.isGameOver,
            }"
            height="15"
          ></v-progress-linear>
          <BoardComponent
            :board="player.boardState"
            :patternBoard="player.patternBoard"
            :keyEnteredArray="keyEnteredArray"
            :shake="shake"
            class="main-board-component"
            v-if="player != null"
          />
        </div>
        <KeyboardComponent
          :keypress="keypress"
          :letterToPattern="letterToPattern"
          class="keyboard"
        />
      </v-col>
      <v-col v-if="players.length !== 0" class="second-column">
        <div justify="center" style="" class="second-board-container">
          <div
            v-for="player in players"
            :key="player.id"
            class="board second-board"
          >
            <h3 style="text-align: center; width: 100%">{{ player.name }}</h3>
            <v-progress-linear
              :color="getHpColor(player.hp)"
              :value="getHpValue(player.hp)"
              :background-color="getHpBackgroundColor(player.hp)"
              :class="{
                'animation-disabled': getHpShouldAnimationBeDisabled(player.hp),
                'red--text': player.isGameOver,
              }"
              height="5"
            ></v-progress-linear>
            <BoardComponent
              :board="player.boardState"
              :patternBoard="player.patternBoard"
              style="width: 100%"
              v-if="player != null"
            />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
$minWidth: 200px;

.keyboard {
  margin-top: 5px;
}

.second-board {
  min-width: $minWidth;
  max-width: 250px;
}

.second-board-container {
  margin-top: 22px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;

  /*
  display: grid;
  max-width: 100%;
  grid-template-columns: repeat(auto-fill, max(#{$minWidth}, 32%));
  grid-column-gap: 10px;
  justify-content: space-evenly;
  justify-items: center;
  align-content: space-evenly;
  align-items: center;
  */
}

.main-board-component {
  width: 100%;
  font-size: 38px;
}

.main-board-col {
  min-width: 300px;
  max-width: 400px;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
}

.mobile-players {
  display: none;
}

@media only screen and (max-width: 480px) {
  .container {
    padding: 0px;
  }

  .main-board-col {
    padding: 0 !important;
    height: 100%;
    max-width: 200% !important;
    position: fixed;
  }

  .main-board-container {
    padding-left: 20px;
    padding-right: 20px;
    width: auto !important;
    flex-grow: 1;
  }

  .keyboard {
    width: 100%;
    padding-bottom: 15px;
    padding-left: 0px;
    padding-right: 0px;
  }

  .second-column {
    display: none;
  }

  .mobile-players {
    display: flex;
    gap: 10px;
  }
}
</style>

<style>
.myprogress div:first-child {
  width: 100% !important;
}
.myprogress.v-progress-linear {
  transition: color 0.2s cubic-bezier(0.4, 0, 0.6, 1);
}

.myprogress.animation-disabled {
  transition: none;
}
</style>

<script lang="ts">
import Vue from "vue";
import BoardComponent from "@/components/BoardComponent.vue";
import KeyboardComponent from "@/components/KeyboardComponent.vue";
import GameOverDialog from "@/components/GameOverDialog.vue";
import MobileHealthBars from "@/components/MobileHealthBars.vue";

import { GlobalServices } from "@/services/GlobalServices";
import { IPlayer } from "@/services/Store/IPlayer";
import {
  createEmptyPlayer,
  getBoardArray,
  getEmptyBoardState,
  getPlayerById,
} from "@/services/GameClient/utils";
import { PatternGetter } from "@/services/GameClient/PatternGetter";
import { Subject, Subscription, timer } from "rxjs";
import { colors } from "vuetify/lib";
import { HpColorDefinitions, primaryHpColor } from "@/services/GameGuiUtil";
import { DEFAULT_ID } from "@/services/PeerToPeer/PeerToPeerService";
import { GameModule } from "@/services/Store/modules/Game";

const hpColorUtils = new HpColorDefinitions();

// see https://stackoverflow.com/questions/56002310/property-xxx-does-not-exist-on-type-combinedvueinstancevue-read
declare module "vue/types/vue" {
  interface Vue {
    setupLocalGame: () => void;
    keyEntered: (v: { row: number; col: number }) => void;
    shakeWord: () => void;
    getHpValue: (hp: number) => number;
    getHpColor: (hp: number) => number;
  }
}

export default Vue.extend({
  components: {
    BoardComponent,
    KeyboardComponent,
    GameOverDialog,
    MobileHealthBars,
  },
  data: () => ({
    keypress: new Subject<string>(),
    subscriptions: new Array<Subscription>(),
    letterToPattern: new Array<number>(27),
    shake: new Array<boolean>(6).fill(false),
    keyEnteredArray: getBoardArray(getEmptyBoardState(5, 6)),
    partialSecond: 0,
    hpColor: colors[primaryHpColor].lighten1,
  }),
  computed: {
    player: () => {
      return getPlayerById(GameModule, GlobalServices.PeerToPeer.getId());
    },
    players() {
      return GameModule.players.filter((t: IPlayer) => t.id != this.player!.id);
    },
    sortedPlayers() {
      return GameModule.sortedPlayers.filter(
        (t: IPlayer) => t.id !== this.player!.id
      );
    },
  },
  methods: {
    shakeWord(): void {
      const row = this.player!.numGuesses;
      Vue.set(this.shake, row, true);
      setTimeout(() => Vue.set(this.shake, row, false), 620);
    },
    keyEntered(v: { row: number; col: number }): void {
      Vue.set(this.keyEnteredArray[v.row], v.col, true);
      setTimeout(() => Vue.set(this.keyEnteredArray[v.row], v.col, false), 160);
    },
    setupLocalGame() {
      console.log("warning - setting up local game");
      GlobalServices.registerGameClient();
      const myPlayer: IPlayer = createEmptyPlayer(DEFAULT_ID);

      GameModule.addPlayer(myPlayer);
      myPlayer.name = "guy";

      const otherPlayers: IPlayer[] = [
        createEmptyPlayer(DEFAULT_ID + "2", "other guy :)"),
        createEmptyPlayer(DEFAULT_ID + "3", "another guy"),
        createEmptyPlayer(DEFAULT_ID + "4", "anoter"),
      ];

      otherPlayers.forEach((t) => GameModule.addPlayer(t));

      setTimeout(() => {
        GlobalServices.GameClient?.applyPattern(otherPlayers[0], "chair", [
          "?",
          "?",
          "?",
          "?",
          "?",
        ]);
      }, 1000);
    },
    getHpColor: (hp: number) => hpColorUtils.getHpColor(hp),
    getHpValue(hp: number) {
      return hpColorUtils.getHpValue(hp, this.partialSecond);
    },
    getHpBackgroundColor: (hp: number) => hpColorUtils.getHpBackgroundColor(hp),
    getHpShouldAnimationBeDisabled: (hp: number) =>
      hpColorUtils.getHpShouldAnimationBeDisabled(hp),
  },

  beforeMount() {
    if (this.player == null) {
      this.setupLocalGame();
    }

    const patternGetter = new PatternGetter(GameModule.seed);
    GlobalServices.GameClient?.startGame(patternGetter);

    this.subscriptions = [
      this.keypress.subscribe((t) => {
        GlobalServices.GameClient?.onKeyPress(t);
      }),
      GlobalServices.GameClient!.invalidGuess.subscribe(() => {
        this.shakeWord();
      }),
      GlobalServices.GameClient!.keyEntered.subscribe((v) => {
        this.keyEntered(v);
      }),
      timer(1000, 1000).subscribe((t) => {
        GlobalServices.GameClient?.tick();
        this.partialSecond = 0;
      }),
      timer(100, 100).subscribe((t) => {
        this.partialSecond = Math.min(1, this.partialSecond + 0.1);
      }),
    ];
  },
  destroyed() {
    this.subscriptions.forEach((t) => t.unsubscribe());
  },
});
</script>
