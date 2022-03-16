import Vue from "vue";
import Vuex from "vuex";
import { IGameState } from "./modules/Game";
import { INotificationState } from "./modules/Notifications";

// declare your own store states
export interface IRootState {
  game: IGameState;
  notifications: INotificationState;
}
Vue.use(Vuex);

// Create a new store instance.
export const store = new Vuex.Store<IRootState>({});
