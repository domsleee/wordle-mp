<template>
  <v-card>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <i
          v-bind="attrs"
          v-on="on"
          v-if="isHost"
          class="fas fa-crown"
          style="
            color: orange;
            transform: rotate(30deg);
            position: absolute;
            right: 5px;
            top: 2px;
          "
        ></i>
      </template>
      <span>{{ player.name }} is the host.</span>
    </v-tooltip>
    <v-card-title>{{ player.name }}</v-card-title>
  </v-card>
</template>

<style scoped></style>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Prop } from "vue/types/options";
import { IPlayer } from "@/services/Store/IPlayer";
import { store } from "@/services/Store/Store";
import { createEmptyPlayer } from "@/services/GameClient/utils";

export default Vue.extend({
  props: {
    player: Object as PropType<IPlayer>,
    isHost: { type: Boolean, default: false },
  },
});
</script>
