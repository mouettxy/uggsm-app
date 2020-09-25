<template lang="pug">
.table-toolbar
  v-toolbar.toolbar(elevation='1', height='72')
    m-office-switcher(:items='offices', @change='onOfficeSwitch')
    v-spacer
    m-search-field(@change='onSearchField')
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import MOfficeSwitcher from '@/components/moleculas/MOfficeSwitcher.vue'
import MSearchField from '@/components/moleculas/MSearchField.vue'

/**
 * Organizm that provides toolbar with office switcher and search field
 *
 * @emmits switch-office
 * @emits search
 */
@Component({
  components: {
    MOfficeSwitcher,
    MSearchField
  }
})
export default class OTableToolbar extends Vue {
  public offices = ['{CODE} {ADDRESS}', 'abc abcde', 'abcde abdec']
  @Prop(String) defaultOffice: any

  onOfficeSwitch(value: string) {
    /**
     * Emits when office switches
     *
     * @property {string} value - selected office
     */
    console.log(value)
    this.$emit('switch-office', value)
  }

  onSearchField(value: string) {
    /**
     * Emits when search fields changes
     *
     * @property {string} value - current search field state
     */
    console.log(value)
    this.$emit('search', value)
  }
}
</script>

<style lang="sass">
.table-toolbar
  height: 73px !important

  .toolbar
    height: 73px !important

    .v-toolbar__content
      height: 100%
</style>
