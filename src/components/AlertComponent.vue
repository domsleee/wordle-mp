<template>
  <v-alert
    transition="fade"
    dismissible
    :type="notification.type"
    v-model="alert"
    outlined
    >{{ notification.msg }}</v-alert
  >
</template>

<script lang="ts">
import { StoredNotification } from "@/services/Store/INotificationType";
import Vue, { PropType } from "vue";
import { store } from "@/services/Store/Store";
import { NotificationsModule } from "@/services/Store/modules/Notifications";

export default Vue.extend({
  props: {
    notification: Object as PropType<StoredNotification>,
  },
  computed: {
    alert: {
      get() {
        // @ts-ignore
        return !this.notification.isHidden;
      },
      set(v) {
        // @ts-ignore
        if (!v) NotificationsModule.hideNotification(this.notification);
      },
    },
  },
});
</script>
