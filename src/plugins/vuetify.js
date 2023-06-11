// Styles
import "@mdi/font/css/materialdesignicons.css";
import colors from "vuetify/lib/util/colors";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

export default createVuetify(
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  {
    theme: {
      defaultTheme: "dark",
      themes: {
        dark: {
          colors: {
            primary: colors.blue.darken1, // #1E88E5
          },
        },
      },
    },
  }
);
