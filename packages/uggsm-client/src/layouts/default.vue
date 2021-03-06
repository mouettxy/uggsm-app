<template lang="pug">
v-main.layout-default(app)
  ug-side-menu(:menu-items='items')
  router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { defaultMenu } from '@/api/helpers/menus'
import UgSideMenu from '@/components/base/ui/side-menu/side-menu.vue'

@Component({
  components: {
    UgSideMenu,
  },
})
export default class LayoutDefault extends Vue {
  public items = defaultMenu
}
</script>

<style lang="sass">
.layout-default
  height: 100%
  padding-left: 48px !important
</style>
