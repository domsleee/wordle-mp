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
import { mutations, store } from "@/services/Store/Store";
import Vue, { PropType } from "vue";
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
        if (!v) mutations.hideNotification(this.notification);
      },
    },
  },
});
</script>
