<template>
  <v-card>
    <v-progress-linear :active="isLoading" indeterminate></v-progress-linear>
    <v-card-title>
      <span>Панель ролей</span>
      <v-spacer></v-spacer>
      <ug-btn-toggle
        v-model="showAddRole"
        active-color="error"
        active-icon="mdi-plus mdi-rotate-45"
        color="primary"
        depressed
        icon-right="mdi-plus"
        label="Добавить роль"
      ></ug-btn-toggle>
    </v-card-title>
    <v-card-text>
      <v-slide-y-transition>
        <ug-role-add v-if="showAddRole" @deactivate="handleRoleAddDeactivate"></ug-role-add>
      </v-slide-y-transition>
      <v-divider></v-divider>
      <ug-role-list @loading="handleListLoading"></ug-role-list>
    </v-card-text>
  </v-card>
</template>

<script>
import UgBtnToggle from '@/components/base/ui/btn-toggle/btn-toggle'
import UgRoleAdd from './role-add/role-add'
import UgRoleList from './role-list/role-list'

export default {
  name: 'ug-role-widget',

  components: {
    UgBtnToggle,
    UgRoleAdd,
    UgRoleList,
  },

  data: () => ({
    showAddRole: false,

    isLoading: false,
  }),

  methods: {
    handleRoleAddDeactivate() {
      this.showAddRole = false
    },

    handleListLoading(state) {
      this.isLoading = state
    },
  },
}
</script>
