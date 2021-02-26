<template lang="pug">
v-combobox(
  v-model.sync='model',
  :search-input='search',
  :label='label',
  :items='items',
  :hide-details='hideDetails',
  small-chips,
  outlined,
  multiple,
  hide-selected,
  dense
)
</template>

<script lang="ts">
//* --------------------------------------------------------------------------
//!                   MOVED NEEDS TO BE REPLACED EVERYWHERE
//* --------------------------------------------------------------------------

import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class ATagInput extends Vue {
  @Prop() label!: string
  @Prop() value!: Array<string> | string
  @Prop() items!: Array<string>
  @Prop({ default: 'auto' }) hideDetails!: string | boolean

  public search = ''

  get model() {
    return this.value
  }

  set model(value: Array<string> | string) {
    this.$emit('input', value)
  }
}
</script>

<style lang="sass"></style>
