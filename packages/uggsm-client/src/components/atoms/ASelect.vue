<template lang="pug">
v-select.a-select(
  v-model='model',
  :smallChips='smallChips',
  :single-line='singleLine',
  :readonly='readonly',
  :prepend-inner-icon='icon',
  :multiple='multiple',
  :label='label',
  :items='items',
  :hideSelected='hideSelected',
  :disabled='disabled',
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
      span {{ item["text"] }}
</template>

<script lang="ts">
//* --------------------------------------------------------------------------
//!                   MOVED NEEDS TO BE REPLACED EVERYWHERE
//* --------------------------------------------------------------------------

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
  @Prop({ required: false }) singleLine!: boolean
  @Prop() disabled!: boolean
  @Prop() cache!: string

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

    if (this.cache) {
      localStorage.setItem(this.cache, JSON.stringify(value))
    }
  }

  onChange() {
    this.$emit('change', this.model)
  }

  mounted() {
    if (this.cache) {
      const cached = localStorage.getItem(this.cache)

      if (cached) {
        const items = JSON.parse(cached)
        this.model = items
        this.$emit('change', items)
      }
    }
  }
}
</script>

<style lang="sass">
.a-select
  .v-select__selections
    input
      max-width: 20px
</style>
