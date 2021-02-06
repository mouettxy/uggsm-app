import { authModule, rolesModule } from './../store/index'
import Vue from 'vue'
import { abilitiesPlugin, Can } from '@casl/vue'
;(async function () {
  let ability
  if (authModule.user?.role) {
    ability = await rolesModule.buildAbility({ role: authModule.user.role, type: 'default' })
  } else {
    ability = await rolesModule.buildAbility({ role: 'guest', type: 'default' })
  }

  Vue.use(abilitiesPlugin, ability, { useGlobalProperties: true })

  Vue.component('Can', Can)
})()
