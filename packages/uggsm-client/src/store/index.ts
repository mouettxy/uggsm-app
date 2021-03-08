import Vue from 'vue'
import Vuex from 'vuex'
import offices from '@/store/offices'
import settings from '@/store/settings'
import auth from '@/store/auth'
import orders from '@/store/orders'
import cash from '@/store/cash'
import client from '@/store/client'
import calls from '@/store/calls'
import createPersistedState from 'vuex-persistedstate'

import { getModule, VuexModule } from 'vuex-module-decorators'
import { ConstructorOf } from '@/typings/api/helpers'

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
  },
  plugins: [persistedState],
})

function getModuleProxy<M extends VuexModule>(S: ConstructorOf<M>): M {
  return getModule(S, store)
}

export const officesModule = getModuleProxy(offices)
export const settingsModule = getModuleProxy(settings)
export const authModule = getModuleProxy(auth)
export const ordersModule = getModuleProxy(orders)
export const cashModule = getModuleProxy(cash)
export const clientModule = getModuleProxy(client)
export const callModule = getModuleProxy(calls)

export default store
