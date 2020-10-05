<template lang="pug">
v-select(
  v-model='model',
  :readonly='readonly',
  :prepend-inner-icon='icon',
  :label='label',
  :items='items',
  :dense='dense',
  :clearable='clearable',
  :hint='hint',
  outlined
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
  @Prop(String) value: any
  @Prop(Array) items: any
  @Prop(String) icon: any
  @Prop(String) label: any
  @Prop(String) hint: any
  @Prop(Boolean) dense: any
  @Prop(Boolean) readonly: any
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
}
</script>
