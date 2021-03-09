<template lang="pug">
v-alert.elevation-2.ug-base-alert(
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
    #close='{ toggle }'
  )
    ug-base-btn(
      :color='type',
      @click='hideAlert(toggle)',
      icon='mdi-close'
    )
</template>

<script>
export default {
  name: 'ug-base-alert',
  props: {
    type: {
      required: false,
      type: [String],
      default: 'info',
    },
    persistent: {
      required: false,
      type: [Boolean],
    },
    uniqueId: {
      required: false,
      type: [String],
    },
    transition: {
      required: false,
      type: [String],
      default: 'slide-y-transition',
    },
  },
  computed: {
    isHidden() {
      if (!this.persistent) {
        const alerts = localStorage.get('closed-alerts')
        if (alerts && alerts[this.$props.uniqueId]) {
          return true
        }
      }

      return false
    },
  },
  methods: {
    hideAlert(closeFn) {
      const uniqueId = this.$props.uniqueId
      if (!this.persistent && uniqueId) {
        let alerts = localStorage.get('closed-alerts')

        if (!alerts) {
          alerts = {}
        }

        alerts[uniqueId] = true
        localStorage.set('closed-alerts', alerts)
      }
      closeFn()
    },
  },
}
</script>
