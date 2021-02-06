import { RoleInput, ResourceInput, AbilityInput, RoleAbility } from './../typings/api/role'
import RoleAPI from '@/api/role'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Roles as RolesType } from '@/typings/api/role'
import { isEmpty } from 'lodash'

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
  socket_updateRoles() {
    this.context.dispatch('getAll')
  }
}
