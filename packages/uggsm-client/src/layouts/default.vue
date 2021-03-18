<template>
  <v-main app class="ug-layout-default" :class="{ 'ug-layout-default--mobile': isMobile }">
    <ug-side-menu :menu-items="items" :mobile="isMobile"></ug-side-menu>
    <router-view></router-view>
  </v-main>
</template>

<script>
import { defaultMenu } from '@/api/helpers/menus'
import UgSideMenu from '@/components/base/ui/side-menu/side-menu.vue'
import Responsive from '@/mixins/responsive'

export default {
  name: 'ug-layout-default',

  components: {
    UgSideMenu,
  },

  mixins: [Responsive],

  data: () => ({
    items: defaultMenu,
  }),
}
</script>

<style lang="sass">
.ug-layout-default
  height: 100%
  padding-left: 48px !important
  &.ug-layout-default--mobile
    padding-left: 16px !important
</style>
