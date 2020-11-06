<template lang="pug">
v-switch(
  v-model='model',
  :prepend-icon='icon',
  :label='label',
  :hide-details='hideDetails'
)
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class ASwitch extends Vue {
  @Prop(Boolean) value: any
  @Prop(String) label: any
  @Prop(String) icon: any
  @Prop({ default: 'auto' }) hideDetails!: boolean | string

  get model() {
    return this.value
  }

  set model(value) {
    this.$emit('input', value)
  }
}
</script>
