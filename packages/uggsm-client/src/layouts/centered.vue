<template lang="pug">
v-main.layout-centered(app)
  ug-side-menu(:menu-items='items')
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

@Component({
  components: {
    UgSideMenu,
  },
})
export default class LayoutDefault extends Vue {
  public items = defaultMenu
}
</script>
