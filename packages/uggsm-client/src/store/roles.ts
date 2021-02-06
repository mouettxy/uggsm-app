import { RoleInput, ResourceInput, AbilityInput, RoleAbility } from './../typings/api/role'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Roles as RolesType } from '@/typings/api/role'
import { isEmpty } from 'lodash'
import RoleAPI from '@/api/role'
import { AbilityBuilder, Ability } from '@casl/ability'
import { compact, each, map } from 'lodash'
import { authModule } from '.'
import Vue from 'vue'

@Module({
  namespaced: true,
  name: 'roles',
})
export default class Roles extends VuexModule {
  public items: RolesType = []
  public role = ''

  @Mutation
  SET_ROLES(roles: RolesType) {
    this.items = roles
  }

  @Mutation
  SET_ROLE(role: string) {
    this.role = role
  }

  @Action
  async getAll() {
    const response = await RoleAPI.getAll()

    let needRoleMandatory = false
    if (isEmpty(this.items)) {
      needRoleMandatory = true
    }

    this.context.commit('SET_ROLES', response.data)

    if (needRoleMandatory) {
      this.context.commit('SET_ROLE', this.items[0].name)
    }
  }

  @Action
  setRole(role: string) {
    this.context.commit('SET_ROLE', role)
  }

  @Action
  async createRole(data: RoleInput) {
    await RoleAPI.create(data)
  }

  @Action
  async deleteRole(role: string) {
    await RoleAPI.delete(role)
  }

  @Action
  async createResource(resource: ResourceInput) {
    await RoleAPI.createResource(this.role, resource)
  }

  @Action
  async deleteResource(resource: string) {
    await RoleAPI.deleteResource(this.role, resource)
  }

  @Action
  async createAbility(data: { resource: string; ability: AbilityInput }) {
    await RoleAPI.createAbility(this.role, data.resource, data.ability)
  }

  @Action
  async deleteAbility(data: { resource: string; ability: string }) {
    await RoleAPI.deleteAbility(this.role, data.resource, data.ability)
  }

  @Action
  async updateAbility(data: { resource: string; ability: RoleAbility }) {
    await RoleAPI.updateAbility(this.role, data.resource, data.ability)
  }

  @Action
  async buildAbility(data: { role: string; type: 'default' | 'update' }) {
    const { can, cannot, rules, build } = new AbilityBuilder(Ability)

    if (data.role === 'administrator') {
      can('manage', 'all')
    } else {
      const permissions = await RoleAPI.getOne(data.role)

      each(permissions.data.resources, (e) => {
        const canAbilities = compact(
          map(e.abilities, (e) => {
            if (e.value) {
              return e.name
            }
          })
        )

        const cannotAbilities = compact(
          map(e.abilities, (e) => {
            if (!e.value) {
              return e.name
            }
          })
        )

        if (canAbilities) {
          can(canAbilities, e.name)
        }

        if (cannotAbilities) {
          cannot(cannotAbilities, e.name)
        }
      })
    }

    if (data.type === 'update') {
      //@ts-ignore
      Vue.prototype.$ability.update(rules)
    } else {
      return build()
    }
  }

  @Action
  socket_updateRoles(role: string) {
    this.context.dispatch('getAll')

    console.log(authModule.user?.role, role)

    if (authModule.user?.role === role) {
      this.context.dispatch('buildAbility', { role, type: 'update' })
    }
  }
}
