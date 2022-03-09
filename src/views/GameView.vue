<template>
  <v-container>
    <v-row style="margin-top: 50px; column-gap: 50px">
      <v-col class="board main-board">
        <h2 style="text-align: center">{{ player.name }}</h2>
        <span style="float: right">{{ player.hp }}s</span>
        <v-progress-linear
          color="blue lighten-1"
          :value="player.hp"
          height="15"
        ></v-progress-linear>
        <BoardComponent
          :board="player.boardState"
          :patternBoard="player.patternBoard"
          :keyEnteredArray="keyEnteredArray"
          :shake="shake"
          style="font-size: 38px; width: 100%"
          v-if="player != null"
        />
        <KeyboardComponent
          :keypress="keypress"
          :letterToPattern="letterToPattern"
          class="keyboard"
        />
      </v-col>
      <v-col v-if="players.length !== 0">
        <div justify="center" style="" class="second-board-container">
          <div
            v-for="player in players"
            :key="player.id"
            class="board second-board"
          >
            <h3 style="text-align: center; width: 100%">{{ player.name }}</h3>
            <v-progress-linear
              color="blue lighten-1"
              :value="player.hp"
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
:root {
}
.keyboard {
  margin-top: 5px;
}

.main-board {
  min-width: 300px;
  max-width: 400px;
  width: 100%;
  margin: auto;
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
</style>

<script lang="ts">
import Vue from "vue";
import BoardComponent from "@/components/BoardComponent.vue";
import KeyboardComponent from "@/components/KeyboardComponent.vue";

import { GlobalServices } from "@/services/GlobalServices";
import { IPlayer } from "@/services/Store/IPlayer";
import { DEFAULT_ID } from "@/services/PeerToPeer/PeerToPeerService";
import {
  createEmptyPlayer,
  getBoardArray,
  getEmptyBoardState,
  getPlayerById,
} from "@/services/GameClient/utils";
import { mutations, store } from "@/services/Store/Store";
import { PatternGetter } from "@/services/GameClient/PatternGetter";
import { Subject, Subscription, timer } from "rxjs";

// see https://stackoverflow.com/questions/56002310/property-xxx-does-not-exist-on-type-combinedvueinstancevue-read
declare module "vue/types/vue" {
  interface Vue {
    setupLocalGame: () => void;
    keyEntered: (v: { row: number; col: number }) => void;
    shakeWord: () => void;
  }
}

export default Vue.extend({
  components: {
    BoardComponent,
    KeyboardComponent,
  },
  data: () => ({
    keypress: new Subject<string>(),
    subscriptions: new Array<Subscription>(),
    letterToPattern: new Array<number>(27),
    shake: new Array<boolean>(6).fill(false),
    keyEnteredArray: getBoardArray(getEmptyBoardState(5, 6)),
    timerSub: null as Subscription | null,
  }),
  computed: {
    player: () => {
      return getPlayerById(store.state, GlobalServices.PeerToPeer.getId());
    },
    players() {
      return store.state.players.filter((t) => t.id != this.player!.id);
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

      mutations.addPlayer(myPlayer);
      myPlayer.name = "guy";

      const otherPlayers: IPlayer[] = [
        createEmptyPlayer(DEFAULT_ID + "2", "other guy :)"),
        createEmptyPlayer(DEFAULT_ID + "3", "another guy"),
        createEmptyPlayer(DEFAULT_ID + "4", "anoter"),
      ];

      otherPlayers.forEach((t) => mutations.addPlayer(t));

      setTimeout(() => {
        mutations.applyPattern({
          player: otherPlayers[0],
          row: 0,
          pattern: ["?", "?", "?", "?", "?"],
          guess: "chair",
        });
      }, 1000);
    },
  },

  beforeMount() {
    if (this.player == null) {
      this.setupLocalGame();
    }

    const patternGetter = new PatternGetter();
    GlobalServices.GameClient?.startGame(patternGetter);
    this.timerSub = timer(1000, 1000).subscribe((t) => {
      mutations.deductHp(this.player!);
    });

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
    ];
  },
  beforeDestroy() {
    this.timerSub?.unsubscribe();
  },
  destroyed() {
    this.subscriptions.forEach((t) => t.unsubscribe());
  },
});
</script>
