<template lang="pug">
.ug-btn-toggle
  ug-base-btn(
    v-bind='$props',
    :icon-right='statedRightIcon',
    :icon-left='statedLeftIcon',
    :color='statedColor',
    @click='handleClick'
  )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class UgBtnToggle extends Vue {
  @Prop({ required: true }) value!: boolean
  @Prop({ required: true }) label!: string
  @Prop({ required: false }) iconLeft!: string
  @Prop({ required: false }) iconRight!: string
  @Prop({ required: false }) color!: string
  @Prop({ required: false }) activeColor!: string
  @Prop({ required: false }) text!: boolean
  @Prop({ required: false }) depressed!: boolean
  @Prop({ required: false }) activeIcon!: string

  get statedColor() {
    return this.model ? this.activeColor : this.color
  }

  get statedLeftIcon() {
    if (!this.activeIcon) {
      return this.iconLeft
    }

    if (!this.iconLeft) {
      return this.iconLeft
    }

    return this.model ? this.activeIcon : this.iconLeft
  }

  get statedRightIcon() {
    if (!this.activeIcon) {
      return this.iconRight
    }

    if (!this.iconRight) {
      return this.iconRight
    }

    return this.model ? this.activeIcon : this.iconRight
  }

  get model() {
    return this.value
  }

  set model(value: boolean) {
    this.$emit('input', value)
  }

  handleClick() {
    this.model = !this.model
  }
}
</script>

<style lang="sass"></style>
