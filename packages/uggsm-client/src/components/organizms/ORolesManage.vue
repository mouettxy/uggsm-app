<template lang="pug">
.role__main
  m-role-add
  v-row.py-4(no-gutters)
    v-col(cols='2')
      m-role-menu
    v-col.pl-4(cols='10')
      m-role-add-resource
      m-role-resources
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { rolesModule } from '@/store'

@Component
export default class ORolesManage extends Vue {
  get items() {
    return rolesModule.items
  }

  mounted() {
    rolesModule.getAll()
  }
}
</script>

<style lang="sass"></style>
