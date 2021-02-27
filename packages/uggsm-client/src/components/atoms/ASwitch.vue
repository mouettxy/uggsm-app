<template lang="pug">
v-switch(
  v-model='model',
  :prepend-icon='icon',
  :label='label',
  :hide-details='hideDetails',
  :flat='flat',
  :disabled='disabled',
  :dense='dense',
  :color='color'
)
  slot(#label)
    span Лабел
    template(name='label')
      span Лабел
</template>

<script lang="ts">
//* --------------------------------------------------------------------------
//!                   MOVED NEEDS TO BE REPLACED EVERYWHERE
//* --------------------------------------------------------------------------

import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class ASwitch extends Vue {
  @Prop() value!: boolean
  @Prop() label!: string
  @Prop() dense!: boolean
  @Prop() flat!: boolean
  @Prop() icon!: string
  @Prop() color!: string
  @Prop() disabled!: boolean
  @Prop({ default: 'auto' }) hideDetails!: boolean | string

  get model() {
    return this.value
  }

  set model(value) {
    this.$emit('input', value)
  }
}
</script>
