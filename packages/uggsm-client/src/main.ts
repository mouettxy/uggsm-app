import 'reflect-metadata'

import Vue from 'vue'
import App from './App.vue'

import '@/plugins/cookies'
import '@/plugins/axios'
import '@/plugins/notifications'
import '@/plugins/mask'
import '@/plugins/socket.io.ts'
import '@/plugins/components'
import '@/plugins/printer'
import '@/plugins/v-mask'
import '@/plugins/masonry'
import '@/plugins/casl'
import '@/plugins/markdown-directive'

import vuetify from '@/plugins/vuetify'

import store from '@/store'
import router from '@/router'

import moment from 'moment'
moment.locale('ru')

Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  router,
  render: (h) => h(App),
}).$mount('#app')
