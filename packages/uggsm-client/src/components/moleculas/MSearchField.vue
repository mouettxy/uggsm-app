<template lang="pug">
.search-field
  v-text-field(
    v-model='value',
    single-line,
    prepend-inner-icon='mdi-magnify',
    outlined,
    label='Поиск',
    hide-details,
    dense,
    clearable
  )
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { settingsModule } from '@/store'
import { debounce } from 'lodash'

/**
 * Atom that provides cool look search field
 *
 * @emits change
 */
@Component
export default class MSearchField extends Vue {
  @Prop({ required: true, type: String }) type!: string

  public value = ''

  public debounced = debounce(settingsModule.setSearch, 300)

  @Watch('value')
  async onValueChanges(value: string) {
    this.debounced({ search: value, type: this.type })
  }

  async beforeDestroy() {
    await settingsModule.setSearch({ search: '', type: this.type })
  }
}
</script>
