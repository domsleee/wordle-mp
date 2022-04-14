<template>
  <v-container>
    <div class="grid-container">
      <transition-group name="fade" tag="p">
        <div class="item" v-for="(index, item) of items" :key="index">
          {{ item }}
        </div>
        <PlayerInfoComponent
          class="item"
          :class="{ secondary: player.id === myId }"
          v-for="player of players"
          :key="player.id"
          :player="player"
          :isHost="player.id === hostId"
        />
      </transition-group>
    </div>
    <v-container style="max-width: 450px">
      <v-row style="display: block" class="text-center"
        >Lobby Code: {{ lobbyCode }}</v-row
      >
      <v-row class="my-5 mx-2" justify="end">
        <v-text-field
          outlined
          label="name"
          v-model="name"
          maxlength="12"
          hide-details="auto"
          @keydown.enter="changeName"
          class="inline-text-field"
          >Name</v-text-field
        >
        <v-btn
          color="primary"
          @click="changeName"
          class="ml-2"
          outlined
          height="56"
          x-large
          >Update</v-btn
        >
      </v-row>

      <v-row class="my-5 mx-2" justify="end">
        <v-tooltip bottom :disabled="myId === hostId">
          <template v-slot:activator="{ on }">
            <div class="tooltip-helper" v-on="on">
              <v-btn
                outlined
                height="56"
                x-large
                color="primary"
                :disabled="myId !== hostId"
                @click="startGame"
                style="width: 100%"
                >Start Game</v-btn
              >
            </div>
          </template>
          <span>Only the host can start the game.</span>
        </v-tooltip>
      </v-row>
    </v-container>
  </v-container>
</template>

<style scoped>
div.grid-container {
  text-align: center;
  /*background: rgba(114, 186, 94, 0.05);*/
}

.inline-text-field {
  width: 0px;
  min-width: 100px;
}

div.tooltip-helper {
  width: 100%;
}

div.tooltip-helper > button {
  margin: 0 !important;
}

.item {
  display: inline-block;
  box-sizing: border-box;
  margin-left: 5px;
  margin-bottom: 5px;
}
</style>

<script lang="ts">
import Vue from "vue";
import PlayerInfoComponent from "@/components/PlayerInfoComponent.vue";
import { createEmptyPlayer, getPlayerById } from "@/services/GameClient/utils";
import { GlobalServices } from "@/services/GlobalServices";
import router, { Routes } from "@/router";
import { GameModule } from "@/services/Store/modules/Game";
export default Vue.extend({
  components: {
    PlayerInfoComponent,
  },
  data: () => ({
    items: new Array<number>(),
    name: "",
  }),
  computed: {
    players: () => {
      return GameModule.players.filter((t) => t.currentRoute === Routes.LOBBY);
    },
    hostId: () => {
      return GlobalServices.PeerToPeer.getHostId();
    },
    myId: () => {
      return GlobalServices.PeerToPeer.getId();
    },
    lobbyCode: () => GlobalServices.PeerToPeer.getHostId(),
  },
  methods: {
    addItem() {
      this.items.push(this.items.length);
    },
    changeName() {
      GameModule.changeName({
        name: this.name,
        player: getPlayerById(GameModule, GlobalServices.PeerToPeer.getId())!,
      });
    },
    startGame() {
      GlobalServices.PeerToPeer.broadcastAndToSelf({
        command: "START_GAME",
        gameId: GameModule.getAndIncrementGameId(),
      });
    },
  },
});
</script>
