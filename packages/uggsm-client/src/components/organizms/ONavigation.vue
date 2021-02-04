<template lang="pug">
v-navigation-drawer.navigation(
  v-model='model',
  :style='{ "max-width": width }',
  :mini-variant='miniMain',
  width='100%',
  stateless,
  permanent,
  dark,
  color='secondary',
  app
)
  template(v-if='secondItemsExists')
    v-row.fill-height(
      :style='{ "min-width": width }',
      no-gutters
    )
      v-navigation-drawer(
        permanent,
        mini-variant-width='56',
        mini-variant,
        color='secondary'
      )
        m-navigation-auth
          template(v-if='isLoggedIn')
            v-divider
            m-navigation-list(:items='items')
      template(v-if='isLoggedIn')
        v-navigation-drawer.grow(
          :mini-variant='mini',
          stateless,
          permanent,
          mini-variant-width='56',
          color='secondary'
        )
          m-navigation-list(:items='secondItems')
          v-list.navigation-unminify(
            nav,
            dense
          )
            v-list-item
              v-list-item-icon
                v-icon(@click.stop='mini = !mini')
                  template(v-if='mini') mdi-chevron-right
                  template(v-else) mdi-chevron-left
  template(v-else)
    m-navigation-auth
    template(v-if='isLoggedIn')
      v-divider
      m-navigation-list(:items='items')
      template(v-if='mini')
        v-list.navigation-unminify(
          nav,
          dense
        )
          v-list-item
            v-list-item-icon
              v-icon(@click.stop='mini = !mini') mdi-chevron-right
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { authModule, settingsModule } from '@/store'

@Component
export default class ONavigation extends Vue {
  @Prop(Array) items!: Array<any>
  @Prop({ type: Array, default: () => [] }) secondItems!: Array<any>

  public model = true

  get isLoggedIn() {
    return authModule.isLoggedIn
  }

  get width() {
    let width
    if (this.secondItems.length && this.mini) {
      width = 112
    } else if (this.secondItems.length) {
      width = 330
    } else {
      width = 256
    }
    return `${width}px`
  }

  get mini() {
    return settingsModule.miniNavigation
  }

  set mini(state: boolean | null) {
    settingsModule.setMiniNavigation(state)
  }

  get miniMain() {
    return this.mini && !this.secondItemsExists
  }

  get secondItemsExists() {
    return this.secondItems.length > 0
  }
}
</script>

<style lang="sass" scoped>
.navigation
  .v-list-item--active
    .v-list-item__icon
      color: #1859a1
  &-unminify
    position: absolute
    bottom: 0
</style>
