<template lang="pug">
.fullscreen-modal
  slot(
    name='activator',
    :click='toggleModal'
  )
  v-dialog(
    v-model='value',
    transition='dialog-bottom-transition',
    fullscreen
  )
    v-card.card
      slot(
        name='content',
        :close='toggleModal'
      )
</template>

<script lang="ts">
//* --------------------------------------------------------------------------
//!                     DEPRECATED NEEDS TO BE REMOVED
//* --------------------------------------------------------------------------

import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class AFullscreenModal extends Vue {
  public value = false
  @Prop(String) title: any
  @Prop(Boolean) active: any

  toggleModal() {
    this.value = !this.value
  }

  mounted() {
    if (this.active) {
      this.value = true
    }
  }
}
</script>
