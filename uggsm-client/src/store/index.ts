import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

/* import { getModule } from 'vuex-module-decorators'; */

Vue.use(Vuex)

export const persistedState = createPersistedState()

export const store = new Vuex.Store({
  state: {},
  modules: {},
  plugins: [persistedState]
})

/* export const authModule = getModule(auth, store)
export const addressesModule = getModule(addresses, store) */

export default store
