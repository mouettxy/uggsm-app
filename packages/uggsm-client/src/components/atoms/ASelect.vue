<template lang="pug">
v-select.a-select(
  v-model='model',
  :smallChips='smallChips',
  :readonly='readonly',
  :prepend-inner-icon='icon',
  :multiple='multiple',
  :label='label',
  :items='items',
  :hideSelected='hideSelected',
  :dense='dense',
  :deletableChips='deletableChips',
  :clearable='clearable',
  :chips='chips',
  :hint='hint',
  @change='onChange',
  outlined,
  hide-details='auto'
)
  template(#selection='{item, index}')
    slot(
      name='selection',
      :item='item',
      :index='index'
    )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

/**
 * Describes default app input
 *
 * @emits input
 */
@Component
export default class ASelect extends Vue {
  @Prop({ type: [String, Array] }) value!: string | string[]
  @Prop(Array) items: any
  @Prop(String) icon: any
  @Prop(String) label: any
  @Prop(String) hint: any
  @Prop({ type: Boolean, default: true }) dense: any
  @Prop({ type: Boolean, default: false }) readonly: any
  @Prop({ type: Boolean, default: false }) multiple!: boolean
  @Prop({ type: Boolean, default: false }) chips!: boolean
  @Prop({ default: false }) smallChips!: boolean
  @Prop({ default: false }) hideSelected!: boolean
  @Prop({ default: false }) deletableChips!: boolean
  @Prop({ default: true, type: Boolean }) clearable: any

  get model() {
    return this.value
  }

  set model(value) {
    /**
     * Emits changed input
     *
     * @property {string} value - changed string
     */
    this.$emit('input', value)
  }

  onChange() {
    this.$emit('change', this.model)
  }
}
</script>

<style lang="sass">
.a-select
  .v-select__selections
    input
      max-width: 20px
</style>
