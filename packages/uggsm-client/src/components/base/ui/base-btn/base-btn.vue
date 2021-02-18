<template lang="pug">
v-btn.ug-base-btn(
  :type='type',
  :text='text',
  :icon='!!icon',
  :disabled='disabled',
  :depressed='depressed',
  :color='color',
  @click='handleClick'
)
  template(v-if='icon')
    v-icon {{ icon }}
  template(v-else)
    v-icon(
      v-if='iconLeft',
      left
    ) {{ iconLeft }}
    span {{ label }}
    v-icon(
      v-if='iconRight',
      right
    ) {{ iconRight }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class UgBaseBtn extends Vue {
  @Prop({ required: false }) label!: string
  @Prop({ required: false }) icon!: string
  @Prop({ required: false }) iconLeft!: string
  @Prop({ required: false }) iconRight!: string
  @Prop({ required: false }) color!: string
  @Prop({ required: false }) text!: boolean
  @Prop({ required: false }) depressed!: boolean
  @Prop({ required: false }) disabled!: boolean
  @Prop({ required: false }) type!: string

  handleClick(event: Event) {
    this.$emit('click', event)
  }
}
</script>

<style lang="sass"></style>
