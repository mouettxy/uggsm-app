<template lang="pug">
v-select(
  v-model='model',
  :items='items',
  :prepend-inner-icon='icon',
  :label='label',
  :hint='hint',
  :dense='dense',
  :readonly='readonly',
  outlined,
  :clearable='clearable'
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
