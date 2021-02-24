<template lang="pug">
.ug-role-list
  v-row
    v-col(cols='2')
      ug-role-menu(
        :roles-to-hide='rolesToHide',
        :items='roles',
        @select='handleMenuSelect'
      )
    v-col(cols='10')
      ug-role-information(:role='currentRole')
</template>

<script lang="ts">
import RoleAPI from '@/api/role'
import { Role, Roles } from '@/typings/api/role'
import { Socket } from 'vue-socket.io-extended'
import { Component, Vue } from 'vue-property-decorator'
import { find } from 'lodash'

const HIDE_ROLES = {
  ADMINISTRATOR: 'administrator',
}

@Component
export default class UgRoleList extends Vue {
  public roles: Roles | null = null

  public role: Role | null = null

  public rolesToHide = [HIDE_ROLES.ADMINISTRATOR]

  @Socket('roles updated')
  async onSocketRolesUpdated() {
    this.roles = await this.fetchRoles()
  }

  get currentRole() {
    if (!this.role && this.roles) {
      return find(this.roles, (e) => !this.rolesToHide.includes(e.value))
    } else if (this.role) {
      return this.role
    }

    return ''
  }

  async fetchRoles() {
    this.$emit('loading', true)
    const apiResponse = await RoleAPI.getAll()

    if (!(apiResponse.status === 200)) {
      return null
    }

    this.$emit('loading', false)

    return apiResponse.data
  }

  handleMenuSelect(role: Role) {
    this.role = role
  }

  async mounted() {
    this.roles = await this.fetchRoles()
  }
}
</script>

<style lang="sass"></style>
