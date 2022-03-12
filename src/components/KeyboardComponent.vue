<template>
  <v-container class="container">
    <div
      v-for="(row, rowIndex) in rows"
      :key="rowIndex"
      class="keyboardRow justify-center"
    >
      <div
        v-for="(char, colIndex) in row"
        :key="colIndex"
        class="column"
        :class="{ enter: char === 'ENTER' }"
      >
        <v-btn
          class="btn keyboard-btn"
          :ripple="{ class: 'blue--text', center: true }"
          :class="{
            [charToClass(
              letterToPattern[keyIndexArray[rowIndex][colIndex]]
            )]: true,
          }"
          @click="handleClick(char)"
        >
          <i v-if="char === 'BS'" class="fas fa-backspace"></i>
          <span v-else>{{ char }}</span>
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<style>
.keyboard-btn span.v-ripple__animation {
  transition-duration: 0.01s, 0.01s;
}
</style>

<style scoped>
.container {
  --key-margin: 3px;
  --item-width: 10%; /*calc(10% - var(--key-margin));*/
}
.keyboardRow {
  display: flex;
}
.column {
  padding-right: var(--key-margin);
  padding-bottom: var(--key-margin);
  width: var(--item-width);
  box-sizing: border-box;
}
.keyboardRow:nth-child(2) {
  /*margin-left: calc(var(--item-width) * 0.3);*/
}
.btn .v-btn__content {
  padding: 0px;
}
.btn,
.btn:before {
  font-size: 18px;
  padding: 0px 0px !important;
  width: 100% !important;
  min-width: 0 !important;
  height: 48px !important;
  background: grey;
}
.column.enter {
  width: calc(var(--item-width) * 2) !important;
}
.column.enter .btn {
  font-size: 12px;
}
</style>

<script lang="ts">
import { A_CHAR_CODE } from "@/services/GameClient/PatternGetter";
import {
  charToClass,
  getPlayerById,
  PatternCharOrBlank,
} from "@/services/GameClient/utils";
import { GlobalServices } from "@/services/GlobalServices";
import { store } from "@/services/Store/Store";
import { Subject } from "rxjs";
import Vue, { PropType } from "vue";

function getKeyboardLayout(): Array<Array<string>> {
  return [
    "qwertyuiop".split(""),
    "asdfghjkl".split(""),
    ["ENTER", ..."zxcvbnm".split(""), "BS"],
  ];
}

function getKeyIndexArray(keyboardLayout: Array<Array<string>>) {
  let res = new Array<Array<number>>();
  for (let row of keyboardLayout) {
    const rowRes = new Array<number>();
    for (let char of row) {
      if (char.length !== 1) {
        rowRes.push(26);
      } else {
        rowRes.push(char.charCodeAt(0) - A_CHAR_CODE);
      }
    }
    res.push(rowRes);
  }
  return res;
}

export default Vue.extend({
  props: {
    keypress: Subject,
  },
  data: () => ({
    rows: getKeyboardLayout(),
    keyIndexArray: getKeyIndexArray(getKeyboardLayout()),
  }),
  computed: {
    letterToPattern() {
      console.log("players", store.state.players);
      return getPlayerById(store.state, GlobalServices.PeerToPeer.getId())!
        .letterToPattern;
    },
  },
  methods: {
    handleClick(char: string) {
      if (char == "ENTER") {
        this.keypress.next("Enter");
      } else if (char === "BS") {
        this.keypress.next("Backspace");
      } else this.keypress.next(char);
    },
    charToClass: (char: PatternCharOrBlank) => {
      if (char == "_") {
        return "incorrect black darken-4";
      }
      if (char == "") {
        return "grey darken-2";
      }
      return charToClass(char);
    },
  },
});
</script>
