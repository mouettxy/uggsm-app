<template lang="pug">
v-main.layout-settings(app)
  o-navigation(
    :secondItems='settingsMenu',
    :items='items'
  )
  router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { defaultMenu, settingsMenu } from '@/api/helpers/menus'

@Component
export default class LayoutSettings extends Vue {
  public items = defaultMenu
  public settingsMenu = settingsMenu
}
</script>

<style lang="sass">
.layout-settings
  height: 100%
</style>
