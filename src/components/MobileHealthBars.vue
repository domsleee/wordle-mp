<template>
  <!-- <div style="width: 100%; display: flex"> -->
  <transition-group
    name="position"
    tag="div"
    style="width: 100%; display: flex"
  >
    <div
      v-for="player in players"
      :key="player.id"
      class="mobile-progress-container"
    >
      <v-progress-circular
        :rotate="270"
        :size="50"
        :width="4"
        :value="getHpValue(player.hp)"
        :color="getHpColor(player.hp)"
        :background-color="getHpBackgroundColor(player.hp)"
        class="mobile-progress text-subtitle-2"
        :class="{
          'second-circular': getHpShouldSecondCircle(player.hp),
          'animation-disabled': getHpShouldAnimationBeDisabled(player.hp),
        }"
      >
        {{ player.hp }}
      </v-progress-circular>
      <span
        class="text-subtitle-2"
        :class="{ 'red--text': player.isGameOver }"
        >{{ player.name }}</span
      >
    </div>
    <!-- </div> -->
  </transition-group>
</template>

<style scoped>
.mobile-progress-container {
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

<style>
.second-circular .v-progress-circular__underlay {
  stroke: var(--hp-color);
}
.mobile-progress-container {
  transition: transform 0.5s ease-in-out;
}

.mobile-progress .v-progress-circular__overlay {
  transition: color 0.6s ease-in-out;
}

.mobile-progress.animation-disabled .v-progress-circular__overlay {
  transition: none;
}
</style>

<script lang="ts">
import Vue, { PropType } from "vue";
import { IPlayer } from "@/services/Store/IPlayer";
import { HpColorDefinitions, primaryHpColor } from "@/services/GameGuiUtil";

const hpColorUtils = new HpColorDefinitions();

export default Vue.extend({
  props: {
    players: Array as PropType<IPlayer[]>,
    partialSecond: Number,
  },
  methods: {
    getHpColor: (hp: number) => hpColorUtils.getHpColor(hp),
    getHpValue(hp: number) {
      return hpColorUtils.getHpValue(hp, this.partialSecond);
    },
    getHpBackgroundColor: (hp: number) => hpColorUtils.getHpBackgroundColor(hp),
    getHpShouldAnimationBeDisabled: (hp: number) =>
      hpColorUtils.getHpShouldAnimationBeDisabled(hp),
    getHpShouldSecondCircle(hp: number) {
      return hp > 60;
    },
  },
});
</script>
