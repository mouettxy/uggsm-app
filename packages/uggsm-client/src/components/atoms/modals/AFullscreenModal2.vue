<template lang="pug">
.fullscreen-modal-2
  v-dialog(
    v-model='model',
    transition='dialog-bottom-transition',
    fullscreen
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
export default class AFullscreenModal extends Vue {
  @Prop(Boolean) value!: boolean

  get model() {
    return this.value
  }

  set model(value) {
    this.$emit('input', value)
  }
}
</script>
