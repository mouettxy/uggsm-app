<template lang="pug">
v-textarea(
  v-model='model',
  :rules='validate',
  :prepend-inner-icon='icon',
  :label='label',
  :hide-details='hideDetails ? "auto" : false',
  :dense='dense',
  :hint='hint',
  validate-on-blur,
  rows='2',
  outlined,
  no-resize,
  clearable,
  auto-grow
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
export default class ATextarea extends Vue {
  @Prop([String, Number]) value: any
  @Prop(String) icon: any
  @Prop(String) label: any
  @Prop(String) hint: any
  @Prop(Array) validate: any
  @Prop(Boolean) dense: any
  @Prop(Boolean) hideDetails!: boolean

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
