<template lang="pug">
v-main.layout-default(
  :class='{ "layout-default--mobile": isMobile }',
  app
)
  ug-side-menu(
    :mobile='isMobile',
    :menu-items='items'
  )
  router-view
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
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
.layout-default
  height: 100%
  padding-left: 48px !important
  &.layout-default--mobile
    padding-left: 16px !important
</style>
