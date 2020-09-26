<template lang="pug">
v-navigation-drawer.main-navigation(app, v-model='model', :mini-variant.sync='mini', color='secondary', dark)
  slot(name='header')
    v-list
      v-list-item.px-2
        template(v-if='isLoggedIn')
          v-list-item-avatar
            v-btn(icon, @click='logout')
              v-icon mdi-exit-run
          v-list-item-title {{ user.credentials }}
        template(v-else)
          v-btn(icon, @click='refreshAnimal')
            v-icon mdi-refresh
          v-list-item-title {{ animal }}
        v-btn(icon, @click.stop='mini = !mini')
          v-icon mdi-chevron-left
  v-divider
  v-list
    template(v-for='item in items')
      template(v-if='item.divider')
        v-divider.my-1
      v-list-item(:to='{ name: item.linkName }', color='#fafafa', :key='item.title')
        v-list-item-icon
          v-icon {{ item.icon }}
        v-list-item-content
          v-list-item-title {{ item.title }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { authModule } from '@/store'
import { getAnonymousAnimal } from '@/api/helpers'

@Component
export default class OMainNavigation extends Vue {
  @Prop(Array) items: any
  public animal = ''
  public model = true
  public mini = false

  get user() {
    return authModule.user
  }

  get isLoggedIn() {
    return authModule.isLoggedIn
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
.main-navigation
  .v-list-item--active
    .v-list-item__icon
      color: #1859a1
</style>
