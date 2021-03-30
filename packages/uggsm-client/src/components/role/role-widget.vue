<template lang="pug">
v-card
  v-progress-linear(
    :active='isLoading',
    indeterminate
  )
  v-card-title 
    span Панель ролей
    v-spacer
    ug-btn-toggle(
      v-model='showAddRole',
      label='Добавить роль',
      icon-right='mdi-plus',
      depressed,
      color='primary',
      active-icon='mdi-plus mdi-rotate-45',
      active-color='error'
    )

  v-card-text
    v-slide-y-transition
      ug-role-add(
        v-if='showAddRole',
        @deactivate='handleRoleAddDeactivate'
      )
    v-divider
    ug-role-list(@loading='handleListLoading')
</template>

<script>
import UgRoleAdd from '@/components/role/role-add/role-add'
import UgRoleList from '@/components/role/role-list/role-list'
import UgBtnToggle from '@/components/base/ui/btn-toggle/btn-toggle'

export default {
  name: 'ug-role-widget',

  components: {
    UgRoleAdd,
    UgRoleList,
    UgBtnToggle,
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
