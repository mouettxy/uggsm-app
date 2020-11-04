<template lang="pug">
v-main.layout-default(app)
  o-navigation(
    :secondItems='reportsMenu',
    :items='items'
  )
  router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { defaultMenu, reportsMenu } from '@/api/helpers/menus'

@Component
export default class LayoutDefault extends Vue {
  public items = defaultMenu
  public reportsMenu = reportsMenu
}
</script>

<style lang="sass">
.layout-default
  height: 100%
</style>
