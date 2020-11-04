<template lang="pug">
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
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { authModule, settingsModule } from '@/store'
import { getAnonymousAnimal } from '@/api/helpers'

@Component
export default class MNavigationAuth extends Vue {
  public animal = ''

  get user() {
    return authModule.user
  }

  get isLoggedIn() {
    return authModule.isLoggedIn
  }

  get mini() {
    return settingsModule.miniNavigation
  }

  set mini(state: boolean | null) {
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

<style lang="sass"></style>
