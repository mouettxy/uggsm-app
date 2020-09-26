import Vue from 'vue'
import Vuex from 'vuex'
import offices from '@/store/offices'
import settings from '@/store/settings'
import createPersistedState from 'vuex-persistedstate'

import { getModule } from 'vuex-module-decorators'

Vue.use(Vuex)

export const persistedState = createPersistedState()

export const store = new Vuex.Store({
  state: {},
  modules: {
    offices,
    settings,
  plugins: [persistedState]
})

export const officesModule = getModule(offices, store)
export const settingsModule = getModule(settings, store)

export default store
