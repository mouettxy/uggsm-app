<template lang="pug">
v-list(
  nav,
  dense
)
  template(v-for='item in items')
    template(v-if='item.resource')
      template(v-if='item.divider')
        v-divider.my-1
      v-list-item(
        v-if='canAccessResource(item.linkName)',
        :to='{ name: item.linkName }',
        :key='item.title',
        color='#fafafa'
      )
        v-list-item-icon
          v-icon {{ item.icon }}
        v-list-item-content
          v-list-item-title {{ item.title }}
    template(v-else)
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
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class MNavigationDrawer extends Vue {
  @Prop({ type: Array, default: () => [] }) items!: Array<any>

  canAccessResource(resource: string) {
    if (this.$can('access', 'Global', resource)) {
      return true
    }

    return false
  }
}
</script>

<style lang="sass"></style>
