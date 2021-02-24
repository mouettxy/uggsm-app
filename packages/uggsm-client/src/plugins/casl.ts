import { UggsmAbility } from './../typings/UggsmAbility'
import RoleAPI from './../api/role'
import { authModule } from './../store/index'
import Vue from 'vue'
import { abilitiesPlugin } from '@casl/vue'
import { AbilityBuilder } from '@casl/ability'
import { compact, each, map } from 'lodash'
import { LOCAL_STORAGE } from '@/api/helpers/Constants'

enum Default {
  RESOURCE = 'Global',
}

export const fieldMatcher = <T extends string>(
  fieldsWrapper: {
    fields: T[]
    operator: 'in array' | 'not in array'
  }[]
) => (field: T) => {
  const fields = fieldsWrapper[0]

  if (fields.operator === 'in array') {
    return fields.fields.includes(field)
  } else if (fields.operator === 'not in array') {
    return !fields.fields.includes(field)
  }

  return true
}

export async function buildAbility(data: { role: string; type: 'default' | 'update' }) {
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
        if (e) {
          const abilityResource = e.resource ? e.resource : Default.RESOURCE

          // idk how to type this
          // @ts-ignore
          can(e.name, abilityResource, [{ fields: e.value, operator: e.operator }])
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
    Vue.prototype.$ability.update(rules)
  } else {
    // idk how to type this
    // @ts-ignore
    return build({ fieldMatcher })
  }
}

export async function tryUpdateRoleAbilities(role: string) {
  if (authModule.user?.role === role) {
    await buildAbility({ role, type: 'update' })
  }
}

export async function initCASL() {
  const cachedRole = localStorage.getItem(LOCAL_STORAGE.CURRENT_ROLE)
  let ability
  if (cachedRole) {
    ability = await buildAbility({ role: cachedRole, type: 'default' })
  } else {
    ability = await buildAbility({ role: 'guest', type: 'default' })
  }

  Vue.use(abilitiesPlugin, ability, { useGlobalProperties: true })
}

initCASL()
