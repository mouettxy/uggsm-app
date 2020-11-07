import Vue from 'vue'
import Vuex from 'vuex'
import offices from '@/store/offices'
import settings from '@/store/settings'
import auth from '@/store/auth'
import orders from '@/store/orders'
import cash from '@/store/cash'
import client from '@/store/client'
import calls from '@/store/calls'
import emailSubscription from '@/store/emailSubscription'
import createPersistedState from 'vuex-persistedstate'

import { getModule } from 'vuex-module-decorators'

Vue.use(Vuex)

export const persistedState = createPersistedState({
  paths: ['settings', 'offices', 'auth'],
})

export const store = new Vuex.Store({
  state: {},
  modules: {
    offices,
    settings,
    auth,
    orders,
    cash,
    client,
    calls,
    emailSubscription,
  },
  plugins: [persistedState],
})

export const officesModule = getModule(offices, store)
export const settingsModule = getModule(settings, store)
export const authModule = getModule(auth, store)
export const ordersModule = getModule(orders, store)
export const cashModule = getModule(cash, store)
export const clientModule = getModule(client, store)
export const callModule = getModule(calls, store)
export const emailSubscriptionModel = getModule(emailSubscription, store)

export default store
