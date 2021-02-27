<template lang="pug">
a-select(
  v-model='model',
  :label='label',
  :items='items',
  :cache='cache',
  @change='onChange',
  multiple,
  dense
)
  template(#selection='{ item, index }')
    v-chip(
      v-if='index === 0',
      small
    )
      span {{ item.text }}
    v-menu(open-on-hover)
      template(#activator='{on, attrs}')
        v-chip(
          v-if='index === 1',
          v-on='on',
          v-bind='attrs',
          small
        )
          | (+{{ model.length - 1 }})
      v-card(dark)
        v-card-text
          span.white--text {{ joinArray(model.slice(1)) }}
</template>

<script lang="ts">
//* --------------------------------------------------------------------------
//!                   MOVED NEEDS TO BE REPLACED EVERYWHERE
//* --------------------------------------------------------------------------

import { map, join, find } from 'lodash'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class ASelectMany extends Vue {
  @Prop() label!: string
  @Prop() cache!: string
  @Prop() items!: Array<{ text: string; value: string }>
  @Prop() value!: Array<string>

  joinArray(arr: string[]) {
    return join(
      map(arr, (e) => find(this.items, { value: e })?.text || ''),
      ', '
    )
  }

  get model() {
    return this.value
  }

  set model(value) {
    this.$emit('input', value)
  }

  onChange() {
    this.$emit('change', this.model)
  }
}
</script>

<style lang="sass"></style>
