<template lang="pug">
v-btn.ug-base-btn(
  :text='text',
  :depressed='depressed',
  :color='color',
  @click='handleClick'
)
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
  @Prop({ required: true }) label!: string
  @Prop({ required: false }) iconLeft!: string
  @Prop({ required: false }) iconRight!: string
  @Prop({ required: false }) color!: string
  @Prop({ required: false }) text!: boolean
  @Prop({ required: false }) depressed!: boolean

  handleClick(event: Event) {
    this.$emit('click', event)
  }
}
</script>

<style lang="sass"></style>
