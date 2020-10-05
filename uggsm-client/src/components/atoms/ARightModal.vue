<template lang="pug">
.right-modal
  slot(name='activator', :click='toggleModal')
  v-dialog(
    v-model='value',
    persistent,
    transition='dialog-bottom-transition',
    overlay-opacity='0.8',
    content-class='right-modal'
  )
    v-card.card
      slot(name='content', :close='toggleModal')
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class ARightModal extends Vue {
  value = false
  @Prop(String) title: any
  @Prop(Boolean) active: any

  toggleModal() {
    this.value = !this.value
    document.documentElement.classList.remove('overflow-y-hidden')
  }

  mounted() {
    if (this.active) {
      this.value = true
    }
    document.documentElement.classList.add('overflow-y-hidden')
  }
}
</script>

<style lang="sass">
.v-dialog.right-modal
  position: absolute
  height: 100vh
  width: 65vw !important
  top: 0
  left: 35vw
  border-radius: 0px !important
  max-height: 100%
  margin: 0
</style>
