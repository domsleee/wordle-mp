<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <img class="header-img" src="@/assets/letterW.png" />
        <h1 class="display-2 font-weight-bold mb-3">Wordle MP</h1>
      </v-col>
    </v-row>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </v-container>
</template>

<style scoped>
.header-img {
  width: 200px;
}
</style>
<script>
import Vue from "vue";
// @ is an alias to /src

export default Vue.extend({
  name: "HomeAndLobbyVue",
  data() {
    return {
      transitionName: "fade",
    };
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      let transitionName = to.meta.transitionName || from.meta.transitionName;

      const toDepth = to.path == "/" ? 1 : to.path.split("/").length;
      const fromDepth = from.path == "/" ? 1 : from.path.split("/").length;
      transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";

      this.transitionName = transitionName;

      next();
    });
  },
});
</script>
