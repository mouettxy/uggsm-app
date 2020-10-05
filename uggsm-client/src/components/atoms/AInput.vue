<template lang="pug">
.input
  template(v-if='type === "number"')
    v-text-field(
      ref='input',
      v-model='model',
      :type='type',
      :rules='validate',
      :prepend-inner-icon='icon',
      :label='label',
      :hide-details='hideDetails ? "auto" : false',
      :dense='dense',
      :hint='hint',
      validate-on-blur,
      outlined,
      clearable
    )
  template(v-else)
    v-text-field(
      ref='input',
      v-model='model',
      :type='type',
      :rules='validate',
      :prepend-inner-icon='icon',
      :label='label',
      :hide-details='hideDetails ? "auto" : false',
      :dense='dense',
      :hint='hint',
      validate-on-blur,
      outlined,
      clearable
    )
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from 'vue-property-decorator'

/**
 * Describes default app input
 *
 * @emits input
 */
@Component
export default class AInput extends Vue {
  @Prop([String, Number]) value: any
  @Prop(String) icon: any
  @Prop(String) label: any
  @Prop(String) hint: any
  @Prop(Array) validate: any
  @Prop(String) type: any
  @Prop(Boolean) dense: any
  @Prop(Boolean) hideDetails!: boolean
  @Ref('input') input: any

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

  mounted() {
    if (this.type === 'number') {
      this.input.$el.querySelector('input').style.appearance = 'textfield'
    }
  }
}
</script>
