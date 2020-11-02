<template lang="pug">
.right-modal
  v-dialog(
    v-model='model',
    transition='dialog-bottom-transition',
    persistent,
    content-class='right-modal'
  )
    template(#activator='{on, attrs}')
      slot(
        name='activator',
        :on='on',
        :attrs='attrs'
      )
    v-card
      slot(name='content')
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class ARightModal extends Vue {
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
  height: 100vh
  width: 50vw !important
  top: 0
  left: 50vw
  border-radius: 0px !important
  max-height: 100%
  margin: 0
</style>
