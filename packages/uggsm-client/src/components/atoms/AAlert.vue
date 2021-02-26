<template lang="pug">
v-alert.elevation-2.base__alert(
  v-if='!isHidden',
  :transition='transition',
  :dismissible='!persistent',
  :color='type',
  text,
  border='left'
)
  slot
  template(
    v-if='!persistent',
    v-slot:close='{ toggle }'
  )
    v-btn(
      @click='closeAlert(toggle)',
      icon
    )
      v-icon(:color='type') mdi-close
</template>

<script lang="ts">
//* --------------------------------------------------------------------------
//!                   MOVED NEEDS TO BE REPLACED EVERYWHERE
//* --------------------------------------------------------------------------

import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AAlert extends Vue {
  @Prop({ default: 'info' }) type?: string
  @Prop({ default: false }) persistent?: boolean
  @Prop() uniqueId!: string
  @Prop({ default: 'slide-y-trasition' }) transition?: string

  closeAlert(toggle: () => any): void {
    const uniqueId = this.$props.uniqueId
    if (!this.$props.persistent && uniqueId) {
      let alerts = localStorage.get('closed-alerts')
      if (!alerts) {
        alerts = {}
      }
      alerts[uniqueId] = true
      localStorage.set('closed-alerts', alerts)
    }
    toggle()
  }

  get isHidden() {
    if (!this.$props.persistent) {
      const alerts = localStorage.get('closed-alerts')
      if (alerts && alerts[this.$props.uniqueId]) {
        return true
      }
    }

    return false
  }
}
</script>

<style lang="sass" scoped></style>
