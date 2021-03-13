<template lang="pug">
v-main.layout-centered(
  :class='{ "layout-centered--mobile": isMobile }',
  app
)
  ug-side-menu(
    :mobile='isMobile',
    :menu-items='items'
  )
  v-container(
    fluid,
    fill-height
  )
    router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { defaultMenu } from '@/api/helpers/menus'
import UgSideMenu from '@/components/base/ui/side-menu/side-menu.vue'
import Responsive from '@/mixins/responsive'

@Component({
  components: {
    UgSideMenu,
  },
})
export default class LayoutDefault extends Responsive {
  public items = defaultMenu
}
</script>

<style lang="sass">
.layout-centered
  padding-left: 48px !important
  &.layout-centered--mobile
    padding-left: 16px !important
</style>
