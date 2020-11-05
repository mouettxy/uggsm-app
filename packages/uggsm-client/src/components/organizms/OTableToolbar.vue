<template lang="pug">
.table-toolbar.elevation-1
  v-row.justify-space-between(no-gutters)
    v-col(cols='auto')
      template(v-if='!hideOffices')
        m-office-switcher(v-model='defaultOffice')
      template(v-else)
        .text-h5 {{ $route.meta.header }}
    v-col(cols='auto')
      m-search-field(:type='$route.name')
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
}
</script>

<style lang="sass">
.table-toolbar
  padding: 8px
</style>
