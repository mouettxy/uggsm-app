import Vue from 'vue'
import Vuex from 'vuex'

import settings from '@/store/settings'
import auth from '@/store/auth'

import filters from '@/store/filters'
import createPersistedState from 'vuex-persistedstate'

import { getModule, VuexModule } from 'vuex-module-decorators'
import { ConstructorOf } from '@/typings/api/helpers'

Vue.use(Vuex)

export const persistedState = createPersistedState({
  paths: ['settings', 'auth'],
})

export const store = new Vuex.Store({
  state: {},
  modules: {
    settings,
    auth,

    filters,
  },
  plugins: [
    createPersistedState({
      paths: ['settings', 'auth'],
    }),
    createPersistedState({
      key: 'filters',
      paths: ['filters'],
    }),
  ],
})

function getModuleProxy<M extends VuexModule>(S: ConstructorOf<M>): M {
  return getModule(S, store)
}

export const settingsModule = getModuleProxy(settings)
export const authModule = getModuleProxy(auth)
export const filtersModule = getModuleProxy(filters)

export default store
