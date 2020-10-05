<template lang="pug">
v-main.layout-centered(app)
  o-main-navigation(:items='items')
  v-container(fluid, fill-height)
    router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import OMainNavigation from '@/components/organizms/OMainNavigation.vue'

@Component({
  components: {
    OMainNavigation,
  },
})
export default class LayoutDefault extends Vue {
  public items = [
    {
      linkName: 'orders',
      title: 'Заявки',
      icon: 'mdi-bat',
      divider: false,
    },
    {
      linkName: 'clients',
      title: 'Клиенты',
      icon: 'mdi-account-group',
      divider: false,
    },
    {
      linkName: 'cash',
      title: 'Касса',
      icon: 'mdi-cash-register',
    },
    {
      linkName: 'analytic',
      title: 'Аналитика',
      icon: 'mdi-google-analytics',
      divider: true,
    },
    {
      linkName: 'settings',
      title: 'Настройки',
      icon: 'mdi-cog',
      divider: true,
    },
  ]
}
</script>

<style lang="sass">
.layout-default
  height: 100%
</style>
