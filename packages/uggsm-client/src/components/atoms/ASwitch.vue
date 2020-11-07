<template lang="pug">
v-switch(
  v-model='model',
  :prepend-icon='icon',
  :label='label',
  :hide-details='hideDetails',
  :color='color'
)
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class ASwitch extends Vue {
  @Prop() value!: boolean
  @Prop() label!: string
  @Prop() icon!: string
  @Prop() color!: string
  @Prop({ default: 'auto' }) hideDetails!: boolean | string

  get model() {
    return this.value
  }

  set model(value) {
    this.$emit('input', value)
  }
}
</script>
