<template>
  <v-container style="max-width: 450px">
    <v-row justify="end" class="mx-2 my-5">
      <v-btn
        block
        :loading="createLoading"
        :disabled="createLoading"
        color="primary"
        @click="createGame()"
        outlined
        height="56"
        x-large
      >
        Create Game
        <template v-slot:loader>
          <span>Loading...</span>
        </template>
      </v-btn>
    </v-row>
    <v-row class="mx-2 my-5">
      <v-text-field
        label="lobby code"
        v-model="lobbyCode"
        height="34"
        style="width: 0px"
        hide-details="auto"
        outlined
      >
      </v-text-field>
      <v-tooltip bottom :disabled="lobbyCode != ''">
        <template v-slot:activator="{ on }">
          <div class="tooltip-helper" v-on="on" style="flex-grow: inherit">
            <v-btn
              :loading="joinLoading"
              :disabled="joinLoading || lobbyCode === ''"
              color="primary"
              class="ma-0 ml-2"
              style="flex-grow: inherit"
              @click="joinGame"
              outlined
              height="56"
              x-large
              >Join game
            </v-btn>
          </div>
        </template>
        <span>Enter a lobby code to join.</span>
      </v-tooltip>

      <template v-slot:loader>
        <span>Loading...</span>
      </template>
    </v-row>
  </v-container>
</template>

<style scoped>
.tooltip-helper {
  display: flex;
  flex-grow: inherit;
}
</style>

<script lang="ts">
import Vue from "vue";
import router from "@/router/index";
import { mutations, store } from "@/services/Store/Store";
import { GlobalServices } from "@/services/GlobalServices";
import { createEmptyPlayer } from "@/services/GameClient/utils";

export default Vue.extend({
  name: "HomeView",

  mounted() {
    GlobalServices.GameClient?.destroy?.();
    mutations.reset();
  },

  data: () => ({
    createLoading: false,
    joinLoading: false,
    lobbyCode: "",
    //
  }),
  methods: {
    createGame: async function () {
      this.createLoading = true;
      try {
        await GlobalServices.PeerToPeer.setupAsHost();
        GlobalServices.registerGameHost();
        this.gotoLobby();
      } catch (e) {
        mutations.raiseNotification({
          type: "error",
          msg: "unable to create game",
          error: e,
        });
        this.createLoading = false;
        throw e;
      }
    },
    joinGame: async function () {
      this.joinLoading = true;
      const lobbyCode = this.lobbyCode;
      try {
        await GlobalServices.PeerToPeer.setupByConnectingToId(lobbyCode);
        this.gotoLobby();
      } catch (e) {
        mutations.raiseNotification({
          type: "error",
          msg: `unable to join lobby code "${lobbyCode}"`,
          error: e,
        });
        this.joinLoading = false;
        throw e;
      }
    },
    gotoLobby: function () {
      GlobalServices.registerGameClient();
      mutations.addPlayer(createEmptyPlayer(GlobalServices.PeerToPeer.getId()));
      router.push("/lobby/" + GlobalServices.PeerToPeer.getId());
    },
  },
});
</script>
