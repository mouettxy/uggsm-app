import Vue from 'vue'
import Vuex from 'vuex'

/* import { getModule } from 'vuex-module-decorators'; */

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {},
  modules: {}
})

/* export const authModule = getModule(auth, store)
export const addressesModule = getModule(addresses, store) */

export default store
