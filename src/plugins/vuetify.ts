import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import "@fortawesome/fontawesome-free/css/all.css"; // Ensure you are using css-loader
import { colors } from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: { primary: colors.green.lighten1 },
    },
  },
  icons: {
    iconfont: "fa",
  },
});
