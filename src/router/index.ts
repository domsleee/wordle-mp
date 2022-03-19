import { GlobalServices } from "@/services/GlobalServices";
import { GameModule } from "@/services/Store/modules/Game";
import { NotificationsModule } from "@/services/Store/modules/Notifications";
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import HomeAndLobbyView from "../views/HomeAndLobbyView.vue";

Vue.use(VueRouter);

export enum Routes {
  LOBBY = "/lobby",
  ABOUT = "/about",
  GAME = "/game",
}

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: HomeAndLobbyView,
    children: [
      { path: "", component: () => import("../views/HomeView.vue") },
      { path: "lobby/:id", component: () => import("../views/LobbyView.vue") },
    ],
  },
  {
    path: Routes.ABOUT,
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.

    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: Routes.GAME,
    name: "game",
    component: () => import("../views/GameView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (from.path.includes("game")) {
    const player = GlobalServices.GameClient?.getMyPlayer();
    if (player != null) {
      GameModule.setPlayerIsInGame({ player, isInGame: false });
    }
  }

  if (
    to.path.includes("lobby") &&
    !GlobalServices.PeerToPeer.getIsConnected()
  ) {
    setTimeout(() => {
      NotificationsModule.raiseNotification({
        type: "warning",
        msg: "rejoining lobbies by refreshing is not supported",
      });
    }, 1000);

    next("/");
  } else next();
});

export default router;
