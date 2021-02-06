<template lang="pug">
v-row.pt-4(no-gutters)
  masonry(
    cols='3',
    gutter='30'
  )
    v-fade-transition(group)
      m-role-resource.mt-2(
        v-for='item in selectedItems',
        :key='item.name',
        :item='item'
      )
</template>

<script lang="ts">
import { rolesModule } from '@/store'
import { RoleResource } from '@/typings/api/role'
import { find } from 'lodash'
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class MRoleResources extends Vue {
  get role() {
    return rolesModule.role
  }

  get items() {
    return rolesModule.items
  }

  public selectedItems: RoleResource[] = []

  @Watch('role')
  onRoleChange() {
    const entry = find(this.items, { name: this.role })

    if (entry) {
      this.selectedItems = entry.resources
    }
  }

  @Watch('items')
  onItemsChange() {
    this.onRoleChange()
  }
}
</script>

<style lang="sass"></style>
