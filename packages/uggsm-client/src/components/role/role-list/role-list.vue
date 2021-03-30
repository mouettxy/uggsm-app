<template lang="pug">
.ug-role-list
  v-row
    v-col(
      cols='12',
      md='3',
      lg='2'
    )
      ug-role-menu(
        :roles-to-hide='rolesToHide',
        :items='roles',
        @select='handleMenuSelect'
      )
    v-col(
      cols='12',
      md='9',
      lg='10'
    )
      ug-role-information(:role='currentRole')
</template>

<script>
import UgRoleInformation from '@/components/role/role-information/role-information'
import UgRoleMenu from '@/components/role/role-menu/role-menu'

import RoleAPI from '@/api/role'
import { find } from 'lodash'

const HIDE_ROLES = {
  ADMINISTRATOR: 'administrator',
}

export default {
  name: 'ug-role-list',

  components: {
    UgRoleInformation,
    UgRoleMenu,
  },

  sockets: {
    async ['roles updated']() {
      this.roles = await this.fetchRoles()
    },
  },

  data: () => ({
    roles: null,
    role: null,
    rolesToHide: Object.freeze([HIDE_ROLES.ADMINISTRATOR]),
  }),

  computed: {
    currentRole() {
      if (!this.role && this.roles) {
        return find(this.roles, (e) => !this.rolesToHide.includes(e.value))
      } else if (this.role) {
        return this.role
      }

      return this.role
    },
  },

  async mounted() {
    this.roles = await this.fetchRoles()
  },

  methods: {
    async fetchRoles() {
      this.$emit('loading', true)
      const apiResponse = await RoleAPI.getAll()

      if (!(apiResponse.status === 200)) {
        return null
      }

      this.$emit('loading', false)

      return apiResponse.data
    },

    handleMenuSelect(role) {
      this.role = role
    },
  },
}
</script>
