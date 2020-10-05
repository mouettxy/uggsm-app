<template lang="pug">
.table-toolbar
  v-toolbar.toolbar(elevation='1', height='72')
    m-office-switcher(:items='offices', :value='defaultOffice', @change='onOfficeSwitch')
    v-spacer
    m-search-field(@change='onSearchField')
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { officesModule, settingsModule } from '@/store'
import { map } from 'lodash'

/**
 * Organizm that provides toolbar with office switcher and search field
 *
 * @emmits switch-office
 * @emits search
 */
@Component
export default class OTableToolbar extends Vue {
  get offices() {
    return map(officesModule.offices, (el) => `${el.code}|${el.name}`)
  }

  get defaultOffice() {
    if (settingsModule.office) {
      return `${settingsModule.office.code}|${settingsModule.office.name}`
    } else {
      settingsModule.setOffice('M1|UGGSM')
      return ''
    }
  }

  onOfficeSwitch(value: string) {
    /**
     * Emits when office switches
     *
     * @property {string} value - selected office
     */
    settingsModule.setOffice(value)
  }

  onSearchField(value: string) {
    /**
     * Emits when search fields changes
     *
     * @property {string} value - current search field state
     */
    this.$emit('search', value)
  }

  mounted() {
    officesModule.fetch()
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
