<template lang="pug">
.table-toolbar
  v-toolbar.toolbar(
    height='72',
    elevation='1'
  )
    template(v-if='!hideOffices')
      m-office-switcher(
        v-model='defaultOffice',
        :items='offices'
      )
    template(v-else)
      .text-h5 {{ $route.meta.header }}
    v-spacer
    m-search-field(@change='onSearchField')
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

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
  @Prop({ default: false, type: Boolean }) hideOffices!: boolean
  get offices() {
    return map(officesModule.offices, (el) => `${el.code}|${el.name}`)
  }

  get defaultOffice() {
    if (settingsModule.office) {
      return `${settingsModule.office.code}|${settingsModule.office.name}`
    } else {
      settingsModule.setOffice({ office: '', type: 'orders' })
      return ''
    }
  }

  set defaultOffice(value) {
    if (this.$route.name === 'orders' || this.$route.name === 'cash') {
      settingsModule.setOffice({ office: value, type: this.$route.name })
    }
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
