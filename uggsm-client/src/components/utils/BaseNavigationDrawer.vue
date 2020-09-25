<template lang="pug">
  v-navigation-drawer.base__navigation-drawer(app, v-model="model", :mini-variant.sync="mini", color="secondary", dark)
    slot(name="header")
      v-list
        v-list-item.px-2
          v-list-item-avatar
            v-icon mdi-account
          v-list-item-title Default user
          v-btn(icon @click.stop='mini = !mini')
            v-icon mdi-chevron-left
    v-divider
    v-list
      template(v-for="item in items")
        template(v-if="item.divider")
          v-divider.my-1
        v-list-item(:to='{name: item.linkName}' color="#fafafa" :key="item.title")
          v-list-item-icon
            v-icon() {{ item.icon }}
          v-list-item-content
            v-list-item-title {{ item.title }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class BaseNavigationDrawer extends Vue {
  @Prop(Array) items: any
  public model = true
  public mini = false
}
</script>

<style lang="sass" scoped>
.base__navigation-drawer
  .v-list-item--active
    .v-list-item__icon
      color: #1859a1
</style>
