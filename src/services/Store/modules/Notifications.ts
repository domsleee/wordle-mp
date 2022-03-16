import { Store } from "vuex";
import {
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import { MyNotification, StoredNotification } from "../INotificationType";
import { store } from "../Store";

export interface INotificationState {
  notifications: Array<StoredNotification>;
}

@Module({
  name: "Notifications",
  dynamic: true,
  store,
})
class Notifications extends VuexModule implements INotificationState {
  public notifications: Array<StoredNotification> = [];

  @Mutation
  raiseNotification(notification: MyNotification) {
    setTimeout(() => {
      this.notifications.push({
        ...notification,
        isHidden: false,
        id: this.notifications.length,
      });
    }, 1000);
  }

  @Mutation
  hideNotification(notification: StoredNotification) {
    this.notifications[notification.id].isHidden = true;
  }
}

export const NotificationsModule = getModule(Notifications);
