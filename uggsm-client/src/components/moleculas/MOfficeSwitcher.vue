<template lang="pug">
.office-switcher
  v-select(
    v-model='model',
    :items='items',
    single-line,
    outlined,
    no-data-text='Похоже нет доступных офисов...',
    menu-props='auto',
    label='Офис',
    hide-details,
    dense
  )
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

/**
 * Atom that switch offices
 *
 * @emits change
 *
 */
@Component
export default class MOfficeSwitcher extends Vue {
  @Prop(Array) items: any
  @Prop(String) value: any

  get model() {
    return this.value
  }

  set model(value) {
    /**
     * Fires when office changes
     *
     * @property {string} value - current office
     */
    this.$emit('input', value)
  }
}
</script>
