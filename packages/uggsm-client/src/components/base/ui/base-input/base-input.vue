<template lang="pug">
v-text-field.ug-input(
  ref='input',
  v-model='model',
  :rules='rules',
  :prepend-inner-icon='icon',
  :placeholder='label',
  :label='label',
  :hide-details='true',
  @blur='handleBlur',
  single-line,
  outlined,
  dense
)
  template(#append)
    .ug-input__append
      .ug-input__hint-content(ref='hint')
        div(v-md.html) {{ hint }}

      .ug-input__mark
        //template(v-if='errors.length')
          v-avatar.ug-input__question-mark(
            ref='append',
            @mouseover.native='handleAppendMouseOver',
            @mouseleave.native='handleAppendMouseLeave',
            @click='handleAppendClick',
            size='24'
          )
            v-icon(
              ref='icon',
              small,
              color='error'
            ) mdi-alert
        template(v-if='hint')
          v-avatar.ug-input__question-mark(
            ref='append',
            @mouseover.native='handleAppendMouseOver',
            @mouseleave.native='handleAppendMouseLeave',
            @click.prevent='handleAppendClick',
            size='24'
          )
            v-icon(
              ref='icon',
              small,
              color='primary'
            ) mdi-help
</template>

<script lang="ts">
import { Component, Prop, Ref, Watch } from 'vue-property-decorator'
import UgBaseInputAnimations from './base-input.animations'

@Component
export default class UgBaseInput extends UgBaseInputAnimations {
  @Prop({ required: true }) value!: string | number
  @Prop({ required: true }) label!: string
  @Prop({ required: false }) icon!: string
  @Prop({ required: false }) hint!: string
  @Prop({ required: false }) rules!: Array<() => boolean>

  @Ref('input') input!: any

  get model() {
    return this.value
  }

  set model(value: string | number) {
    this.$emit('input', value)
  }

  handleAppendMouseOver() {
    const { append }: Record<string, any> = this.$refs

    this.animateAppend(append.$el)
  }

  handleAppendMouseLeave() {
    const { append }: Record<string, any> = this.$refs

    this.deanimateAppend(append.$el)
  }

  handleAppendClick() {
    const { hint }: Record<string, any> = this.$refs

    this.animateHint(hint)
  }

  handleBlur() {
    this.deanimateHint()
  }
}
</script>

<style lang="sass">
.ug-input
  .ug-input__append
    position: relative
    .ug-input__hint-content
      color: #151515 !important
      position: absolute
      display: none
      overflow: hidden
    .ug-input__mark
      margin-top: -1px
      border-radius: 50%
  .v-input__append-inner
    cursor: help !important
</style>
