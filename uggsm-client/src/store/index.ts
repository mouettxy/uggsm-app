import Vue from 'vue'
import Vuex from 'vuex'
import offices from '@/store/offices'
import settings from '@/store/settings'
import auth from '@/store/auth'
import orders from '@/store/orders'
import createPersistedState from 'vuex-persistedstate'

import { getModule } from 'vuex-module-decorators'

Vue.use(Vuex)

export const persistedState = createPersistedState({
  paths: ['settings', 'offices', 'auth']
})

export const store = new Vuex.Store({
  state: {},
  modules: {
    offices,
    settings,
    auth,
    orders
  },
  plugins: [persistedState]
})

export const officesModule = getModule(offices, store)
export const settingsModule = getModule(settings, store)
export const authModule = getModule(auth, store)
export const ordersModule = getModule(orders, store)

export default store
