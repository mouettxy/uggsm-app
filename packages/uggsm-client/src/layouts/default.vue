<template lang="pug">
.layout-default
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
