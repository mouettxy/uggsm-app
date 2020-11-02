<template lang="pug">
.input
  template(v-if='type === "number"')
    v-text-field(
      ref='input',
      v-model='model',
      :type='type',
      :suffix='suffix',
      :rules='validate',
      :prepend-inner-icon='icon',
      :label='label',
      :hide-details='hideDetails ? "auto" : false',
      :dense='dense',
      :clearable='clearable',
      :hint='hint',
      @change='onChange',
      validate-on-blur,
      outlined
    )
  template(v-else)
    v-text-field(
      ref='input',
      v-model='model',
      :type='type',
      :suffix='suffix',
      :rules='validate',
      :prepend-inner-icon='icon',
      :label='label',
      :hide-details='hideDetails ? "auto" : false',
      :dense='dense',
      :clearable='clearable',
      :hint='hint',
      validate-on-blur,
      v-mask='phoneMask',
      outlined
    )
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Emit } from 'vue-property-decorator'

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
  @Prop({ type: String }) suffix!: string
  @Prop({ type: Boolean, default: false }) clearable: any
  @Prop({ type: Boolean, default: true }) dense: any
  @Prop({ type: [Boolean, String], default: 'auto' }) hideDetails!: boolean | string
  @Prop({ type: Boolean, default: false }) phone!: boolean
  @Ref('input') input: any

  get model() {
    return this.value
  }

  set model(value) {
    this.$emit('input', value)
  }

  get phoneMask() {
    if (this.phone) {
      return '+7 (###) ###-##-##'
    } else {
      return false
    }
  }

  @Emit('change')
  onChange() {
    return this.model
  }

  mounted() {
    if (this.type === 'number') {
      this.input.$el.querySelector('input').style.appearance = 'textfield'
    }
  }
}
</script>
