<template lang="pug">
.search-field
  v-text-field(
    v-model='model',
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
import { Component, Vue } from 'vue-property-decorator'

/**
 * Atom that provides cool look search field
 *
 * @emits change
 */
@Component
export default class MSearchField extends Vue {
  public value = ''

  get model() {
    return this.value
  }

  set model(value: string) {
    /**
     * Emits when search changes
     *
     * @property {string} value - input value
     */
    this.$emit('change', value)
  }
}
</script>
