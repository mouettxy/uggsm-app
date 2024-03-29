import Vue from 'vue'
import Vuetify, { VApp, VNavigationDrawer, VFooter, VToolbar, VFadeTransition } from 'vuetify/lib'
import { ClickOutside, Intersect, Mutate, Resize, Ripple, Scroll, Touch } from 'vuetify/lib/directives'
import ru from 'vuetify/src/locale/ru'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VToolbar,
    VFadeTransition,
  },
  directives: {
    Ripple,
    ClickOutside,
    Intersect,
    Mutate,
    Resize,
    Scroll,
    Touch,
  },
})

const vuetifyOpts = {
  rtl: false,
  lang: {
    locales: { ru },
    current: 'ru',
  },
  theme: {
    dark: false,
    options: {
      customProperties: true,
    },
    themes: {
      dark: {
        primary: '#1859a1',
        accent: '#525252',
        accent2: '#1E1E1E',
        secondary: '#383b47',
        success: '#689f38',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#FF5252',
        dark: '#181818',
        light: '#fff',
        softgrey: '#F1F1F1',
      },
      light: {
        primary: '#1859a1',
        accent: '#525252',
        accent2: '#1E1E1E',
        secondary: '#383b47',
        success: '#689f38',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#FF5252',
        dark: '#181818',
        light: '#fff',
        softgrey: '#F1F1F1',

        table_lightgrey: '#F8F6F4',
        table_darkgrey: '#C1C4BD',
        table_darkergrey: '#7A8E85',
      },
    },
  },
}

Vue.use(Vuetify)

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/src/styles/main.sass'

export default new Vuetify(vuetifyOpts)
