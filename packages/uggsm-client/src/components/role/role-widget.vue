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

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class UgRoleWidget extends Vue {
  public showAddRole = false

  public isLoading = false

  handleRoleAddDeactivate() {
    this.showAddRole = false
  }

  handleListLoading(state: boolean) {
    this.isLoading = state
  }
}
</script>
