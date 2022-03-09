<template>
  <v-app>
    <v-main id="app">
      <transition name="fade" mode="out-in">
        <router-view class="view" />
      </transition>
      <v-container
        v-if="notifications.length > 0"
        class="alert-container fixed"
      >
        <AlertComponent
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss">
html {
  overflow: hidden;
  width: 100%;
}
body {
  width: 100%;
  height: 100%;
  position: fixed;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.fixed {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
}
.alert-container {
  width: 600px !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.3s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}
</style>

<script>
import Vue from "vue";
import { store } from "@/services/Store/Store";
import AlertComponent from "@/components/AlertComponent.vue";
const DEFAULT_TRANSITION = "fade";

const app = Vue.extend({
  name: "App",
  components: {
    AlertComponent,
  },
  data() {
    return {
      transitionName: "fade",
    };
  },
  computed: {
    notifications() {
      return store.state.notifications;
    },
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      let transitionName = to.meta.transitionName || from.meta.transitionName;

      const toDepth = to.path == "/" ? 1 : to.path.split("/").length;
      const fromDepth = from.path == "/" ? 1 : from.path.split("/").length;
      transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";

      this.transitionName = transitionName || DEFAULT_TRANSITION;

      next();
    });
  },
});
//app.use(store);

export default app;
</script>
