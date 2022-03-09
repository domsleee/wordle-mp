<template>
  <div class="mycontainer secondary" :style="cssProps">
    <div class="row" v-for="(row, rowIndex) in board" :key="rowIndex">
      <div
        v-for="(col, colIndex) in row"
        :key="colIndex"
        :class="{
          ['col pattern-' +
          charToClass(patternBoard[rowIndex][colIndex])]: true,
          shake: shake[rowIndex],
          press: keyEnteredArray[rowIndex][colIndex],
        }"
        :style="{
          borderColor: col == '' ? `${borderEmpty}!important` : 'white',
        }"
      >
        <span>{{ col.toUpperCase() }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.col {
  background: transparent;
  color: white;
  border-color: white !important;
  border-style: solid !important;
  border-width: var(--border-width);
  margin: var(--col-margin);
  width: 100%;
  aspect-ratio: auto 1;
  text-overflow: clip;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pattern-wrongSpot,
.pattern-correct,
.pattern-incorrect {
  border-color: transparent !important;
}

.mycontainer {
  padding: 25px;
  display: inline-block;
}

.shake {
  animation: shake 0.62s cubic-bezier(0.36, 0.07, 0.19, 0.97) both !important;
  transform: translate3d(0, 0, 0);
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.press {
  animation: press 0.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  animation-iteration-count: 1;
  transform: translate3d(0, 0, 0);
}
@keyframes press {
  0%,
  100% {
    transform: scale3d(1, 1, 1);
  }
  50% {
    transform: scale3d(1.09, 1.09, 1);
  }
}

.row span {
  line-height: 1em;
}
</style>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Observable, Subscription, timer } from "rxjs";
import {
  BoardType,
  charToClass,
  getBoardArray,
  getEmptyBoardState,
} from "@/services/GameClient/utils";
import { PatternChar } from "@/services/GameClient/utils";
import { colors } from "vuetify/lib";
export default Vue.extend({
  name: "BoardComponent",
  props: {
    board: Array as PropType<BoardType>,
    patternBoard: Array as PropType<BoardType>,
    keyEnteredArray: {
      type: Array as PropType<Array<Array<boolean>>>,
      default: () => getBoardArray(getEmptyBoardState(5, 6)),
    },
    shake: {
      type: Array,
      default: () => new Array<boolean>(6).fill(false),
    },
  },
  data: () => ({
    pressDisabled: Array<boolean>(6).fill(false),
    pressTimerSubscriptions: Array<Subscription | null>(6).fill(null),
  }),
  computed: {
    cssProps() {
      return {
        "--border-width": "2px",
        "--col-margin": "2px",
      };
    },
    borderEmpty() {
      return colors.grey.darken2;
    },
  },
  methods: {
    charToClass: (char: PatternChar | "") => charToClass(char),
    checkPress: function (rowIndex: number, colIndex: number) {
      const rowData = this.board[rowIndex][colIndex];
      const ret = rowData != "" && !this.pressDisabled[colIndex];
      if (ret) {
        this.pressDisabled[colIndex] = true;
        setTimeout(() => (this.pressDisabled[colIndex] = false), 150);
      }
      console.log(rowData, ret, this.pressDisabled[colIndex]);
      return ret;
    },
  },
});
</script>
