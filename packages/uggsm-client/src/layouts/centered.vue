<template lang="pug">
v-main.layout-centered(app)
  o-navigation(:items='items')
  v-container(
    fluid,
    fill-height
  )
    router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { defaultMenu } from '@/api/helpers/menus'

@Component
export default class LayoutDefault extends Vue {
  public items = defaultMenu
}
</script>

<style lang="sass">
.layout-default
  height: 100%
</style>
