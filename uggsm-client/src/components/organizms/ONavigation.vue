<template lang="pug">
v-navigation-drawer.navigation(
  v-model='model',
  :width='width',
  :mini-variant='mini',
  stateless,
  permanent,
  dark,
  color='secondary',
  app
)
  template(v-if='secondItems.length > 0')
    v-row.fill-height(no-gutters)
      v-navigation-drawer(
        permanent,
        mini-variant-width='56',
        mini-variant,
        color='secondary'
      )
        v-list-item.px-2(dense)
          template(v-if='isLoggedIn')
            v-list-item-avatar
              v-btn(
                @click='logout',
                icon
              )
                v-icon mdi-exit-run
            v-list-item-title {{ user.credentials }}
          template(v-else)
            v-btn(
              @click='refreshAnimal',
              icon
            )
              v-icon mdi-refresh
            v-list-item-title {{ animal }}
          v-btn(
            @click.stop='mini = !mini',
            icon
          )
            v-icon mdi-chevron-left
        v-divider
        v-list(
          nav,
          dense
        )
          template(v-for='item in items')
            template(v-if='item.divider')
              v-divider.my-1
            v-list-item(
              :to='{ name: item.linkName }',
              :key='item.title',
              color='#fafafa'
            )
              v-list-item-icon
                v-icon {{ item.icon }}
              v-list-item-content
                v-list-item-title {{ item.title }}
      v-list.grow(nav)
        template(v-for='item in secondItems')
          template(v-if='item.divider')
            v-divider.my-1
          v-list-item(
            :to='{ name: item.linkName }',
            :key='item.title',
            color='#fafafa'
          )
            v-list-item-icon
              v-icon {{ item.icon }}
            v-list-item-content
              v-list-item-title {{ item.title }}
  template(v-else)
    v-list-item.px-2(dense)
      template(v-if='isLoggedIn')
        v-list-item-avatar
          v-btn(
            @click='logout',
            icon
          )
            v-icon mdi-exit-run
        v-list-item-title {{ user.credentials }}
      template(v-else)
        v-btn(
          @click='refreshAnimal',
          icon
        )
          v-icon mdi-refresh
        v-list-item-title {{ animal }}
      v-btn(
        @click.stop='mini = !mini',
        icon
      )
        v-icon mdi-chevron-left
    v-divider
    v-list(
      nav,
      dense
    )
      template(v-for='item in items')
        template(v-if='item.divider')
          v-divider.my-1
        v-list-item(
          :to='{ name: item.linkName }',
          :key='item.title',
          color='#fafafa'
        )
          v-list-item-icon
            v-icon {{ item.icon }}
          v-list-item-content
            v-list-item-title {{ item.title }}
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
import { getAnonymousAnimal } from '@/api/helpers'

@Component
export default class ONavigation extends Vue {
  @Prop(Array) items!: Array<any>
  @Prop({ type: Array, default: () => [] }) secondItems!: Array<any>

  public animal = ''
  public model = true

  get user() {
    return authModule.user
  }

  get isLoggedIn() {
    return authModule.isLoggedIn
  }

  get width() {
    return this.secondItems.length ? '15vw' : '10vw'
  }

  get mini() {
    return settingsModule.miniNavigation
  }

  set mini(state: boolean) {
    settingsModule.setMiniNavigation(state)
  }

  refreshAnimal() {
    this.animal = getAnonymousAnimal()
  }

  async logout() {
    await authModule.logout()
    this.$router.push({ name: 'login' })
    this.$notification.success('Вы успешно вышли из системы')
  }

  mounted() {
    if (!this.isLoggedIn) {
      this.refreshAnimal()
    }
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
