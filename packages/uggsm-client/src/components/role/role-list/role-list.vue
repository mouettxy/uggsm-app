<template>
  <div class="ug-role-list">
    <v-row>
      <v-col cols="2">
        <ug-role-menu :items="roles" :roles-to-hide="rolesToHide" @select="handleMenuSelect"></ug-role-menu>
      </v-col>
      <v-col cols="10">
        <ug-role-information :role="currentRole"></ug-role-information>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import UgRoleMenu from '../role-menu/role-menu'
import UgRoleInformation from '../role-information/role-information'
import RoleAPI from '@/api/role'
import { find } from 'lodash'

const HIDE_ROLES = {
  ADMINISTRATOR: 'administrator',
}

export default {
  name: 'ug-role-list',

  components: {
    UgRoleMenu,
    UgRoleInformation,
  },

  sockets: {
    async ['roles updated']() {
      this.roles = await this.fetchRoles()
    },
  },

  data: () => ({
    roles: null,
    role: null,
    rolesToHide: [HIDE_ROLES.ADMINISTRATOR],
  }),

  computed: {
    currentRole() {
      if (!this.role && this.roles) {
        return find(this.roles, (e) => !this.rolesToHide.includes(e.value))
      } else if (this.role) {
        return this.role
      }

      return ''
    },
  },

  mounted: async function () {
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
