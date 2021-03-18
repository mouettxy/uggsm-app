<template>
  <v-main app class="ug-layout-centered" :class="{ 'ug-layout-centered--mobile': isMobile }">
    <ug-side-menu :menu-items="items" :mobile="isMobile"></ug-side-menu>
    <v-container fill-height fluid>
      <router-view></router-view>
    </v-container>
  </v-main>
</template>

<script>
import { defaultMenu } from '@/api/helpers/menus'
import UgSideMenu from '@/components/base/ui/side-menu/side-menu.vue'
import Responsive from '@/mixins/responsive'

export default {
  name: 'ug-layout-centered',

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
.ug-layout-centered
  padding-left: 48px !important
  &.ug-layout-centered--mobile
    padding-left: 16px !important
</style>
