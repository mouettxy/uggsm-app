<template lang="pug">
  v-main.layout-default(app)
    base-navigation-drawer(:items="items")
    router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BaseNavigationDrawer from '@/components/utils/BaseNavigationDrawer.vue'

@Component({
  components: {
    BaseNavigationDrawer
  }
})
export default class LayoutDefault extends Vue {
  public items = [
    {
      linkName: 'orders',
      title: 'Заявки',
      icon: 'mdi-bat',
      divider: false
    },
    {
      linkName: 'clients',
      title: 'Клиенты',
      icon: 'mdi-account-group',
      divider: false
    },
    {
      linkName: 'cash',
      title: 'Касса',
      icon: 'mdi-cash-register'
    },
    {
      linkName: 'analytic',
      title: 'Аналитика',
      icon: 'mdi-google-analytics',
      divider: true
    },
    {
      linkName: 'settings',
      title: 'Настройки',
      icon: 'mdi-cog',
      divider: true
    }
  ]
}
</script>

<style lang="sass">
.layout-default
  height: 100%
</style>
