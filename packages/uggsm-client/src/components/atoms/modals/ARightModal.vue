<template lang="pug">
.right-modal
  v-dialog(
    v-model='model',
    :fullscreen='isMobile',
    :content-class='`right-modal${isMobile ? " is-mobile" : ""}`',
    transition='dialog-bottom-transition',
    persistent
  )
    template(#activator='{on, attrs}')
      slot(
        name='activator',
        :on='on',
        :attrs='attrs'
      )
    v-card
      slot
      slot(name='content')
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from 'vue-property-decorator'
import Responsive from '@/mixins/responive'

@Component
export default class ARightModal extends Mixins(Responsive) {
  @Prop(Boolean) value!: boolean

  get model() {
    return this.value
  }

  set model(value) {
    if (!value) {
      document.documentElement.classList.remove('overflow-y-hidden')
    } else {
      document.documentElement.classList.add('overflow-y-hidden')
    }
    this.$emit('input', value)
  }

  mounted() {
    document.documentElement.classList.add('overflow-y-hidden')
  }
}
</script>

<style lang="sass">
.v-dialog.right-modal
  position: absolute
  height: 100%
  width: 65vw !important
  top: 0
  left: 35vw
  border-radius: 0px !important
  max-height: 100%
  margin: 0
  &.is-mobile
    width: 100% !important
    left: 0
</style>
