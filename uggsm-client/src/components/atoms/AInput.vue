<template lang="pug">
v-text-field(
  v-model='model',
  outlined,
  :prepend-inner-icon='icon',
  :label='label',
  :hint='hint',
  :rules='validate',
  :type='type',
  validate-on-blur,
  clearable
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
export default class AInput extends Vue {
  @Prop(String) value: any
  @Prop(String) icon: any
  @Prop(String) label: any
  @Prop(String) hint: any
  @Prop(Array) validate: any
  @Prop(String) type: any

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
}
</script>
