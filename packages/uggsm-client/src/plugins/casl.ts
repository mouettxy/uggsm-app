import { UggsmAbility } from './../typings/UggsmAbility'
import { Role } from '@/typings/api/role'
import RoleAPI from './../api/role'
import { authModule } from './../store/index'
import Vue from 'vue'
import { abilitiesPlugin, Can } from '@casl/vue'
import { Ability, AbilityBuilder } from '@casl/ability'
import { compact, each, map } from 'lodash'

enum Default {
  RESOURCE = 'Global',
}

async function buildAbility(data: { role: string; type: 'default' | 'update' }) {
  const { can, cannot, rules, build } = new AbilityBuilder(UggsmAbility)

  if (data.role === 'administrator') {
    can('manage', 'all')
  } else {
    const role = await RoleAPI.getOne(data.role)
    const abilities = role.data.abilities

    const arrayAbilities = compact(
      map(abilities, (e) => {
        if (e.type === 'array') {
          return e
        }
      })
    )

    const stringAbilities = compact(
      map(abilities, (e) => {
        if (e.type === 'string') {
          return e
        }
      })
    )

    const booleanAbilities = compact(
      map(abilities, (e) => {
        if (e.type === 'boolean') {
          return e
        }
      })
    )

    if (arrayAbilities.length) {
      each(arrayAbilities, (e) => {
        if (e && (e.value as Array<string>).length > 0) {
          const abilityResource = e.resource ? e.resource : Default.RESOURCE
          if (e.operator === 'in array') {
            can(e.name, abilityResource, e.value as Array<string>)
          } else if (e.operator === 'not in array') {
            cannot(e.name, abilityResource, e.value as Array<string>)
          }
        }
      })
    }

    if (stringAbilities.length) {
      each(stringAbilities, (e) => {
        if (e) {
          const abilityResource = e.resource ? e.resource : Default.RESOURCE
          if (e.operator === 'equals') {
            can(e.name, abilityResource, e.value as string)
          } else if (e.operator === 'not equals') {
            cannot(e.name, abilityResource, e.value as string)
          }
        }
      })
    }

    if (booleanAbilities.length) {
      each(booleanAbilities, (e) => {
        if (e) {
          const abilityResource = e.resource ? e.resource : Default.RESOURCE
          if (e.value) {
            can(e.name, abilityResource)
          } else {
            cannot(e.name, abilityResource)
          }
        }
      })
    }
  }

  if (data.type === 'update') {
    //@ts-ignore
    Vue.prototype.$ability.update(rules)
  } else {
    return build()
  }
}

export async function tryUpdateRoleAbilities(role: string) {
  if (authModule.user?.role === role) {
    await buildAbility({ role, type: 'update' })
  }
}

;(async function () {
  let ability
  if (authModule.user?.role) {
    ability = await buildAbility({ role: authModule.user.role, type: 'default' })
  } else {
    ability = await buildAbility({ role: 'guest', type: 'default' })
  }

  Vue.use(abilitiesPlugin, ability, { useGlobalProperties: true })
  Vue.component('Can', Can)
})()
