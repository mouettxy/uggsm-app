<template lang="pug">
v-main.layout-default(app)
  o-navigation(:items='items')
  router-view
  router-view(name='modal')
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
