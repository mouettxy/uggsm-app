<template lang="pug">
v-dialog(v-model='model')
  slot(name='content')
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class ACenteredModal extends Vue {
  @Prop({ default: false, type: Boolean }) value: any

  get model() {
    return this.value
  }

  set model(value) {
    /**
     * Emits changed input
     *
     * @property {string} value - changed string
     */
    this.$emit('input', value)
  }
}
</script>
