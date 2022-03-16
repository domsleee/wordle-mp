import { GlobalServices } from "@/services/GlobalServices";
import { NotificationsModule } from "@/services/Store/modules/Notifications";
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import HomeAndLobbyView from "../views/HomeAndLobbyView.vue";

Vue.use(VueRouter);

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
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.

    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/game",
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
