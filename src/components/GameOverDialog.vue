<template>
  <v-dialog :value="isVisible" persistent max-width="290">
    <v-card>
      <v-card-title class="text-h5">Game Over</v-card-title>
      <v-card-text v-for="player in players" :key="player.id"
        >{{ player.name }}: {{ player.score }}</v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="backToLobby">
          Back to lobby
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import router, { Routes } from "@/router";
import { GlobalServices } from "@/services/GlobalServices";
import { IPlayer } from "@/services/Store/IPlayer";
import { GameModule } from "@/services/Store/modules/Game";
import Vue from "vue";
export default Vue.extend({
  props: {
    isVisible: Boolean,
  },
  methods: {
    backToLobby() {
      router.push(Routes.LOBBY);
    },
  },
  computed: {
    players: () => {
      return GameModule.players;
    },
  },
});
</script>
