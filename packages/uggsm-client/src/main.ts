import 'reflect-metadata'
import './registerServiceWorker'

import Vue from 'vue'
import App from './App.vue'

import { initSentry } from '@/plugins/sentry'
initSentry()

import '@/plugins/cookies'
import '@/plugins/axios'
import '@/plugins/notifications'
import '@/plugins/mask'
import '@/plugins/socket.io.ts'
import '@/plugins/printer'
import '@/plugins/v-mask'
import '@/plugins/markdown-directive'

import vuetify from '@/plugins/vuetify'

import store from '@/store'
import router from '@/router'

import moment from 'moment'

import { tryUpdateRoleAbilities } from '@/plugins/casl'
moment.locale('ru')

Vue.config.productionTip = false

import InitCASL from '@/plugins/casl'
const initApp = async () => {
  await InitCASL()

  new Vue({
    sockets: {
      ['roles updated'](role: string) {
        tryUpdateRoleAbilities(role)
      },
    },

    vuetify,
    store,
    router,
    render: (h) => h(App),
  }).$mount('#app')
}

initApp()
