<template lang="pug">
v-dialog.ug-modal-right(
  v-model='model',
  :fullscreen='isMobile',
  :content-class='`right-modal${isMobile ? " is-mobile" : ""}`',
  transition='dialog-bottom-transition'
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

<script>
import Responsive from '@/mixins/responsive'

export default {
  name: 'ug-modal-right',

  mixins: [Responsive],

  props: {
    value: {
      required: true,
      type: [Boolean],
    },
  },

  computed: {
    model: {
      get: function () {
        return this.value
      },

      set: function (value) {
        if (!value) {
          document.documentElement.classList.remove('overflow-y-hidden')
        } else {
          document.documentElement.classList.add('overflow-y-hidden')
        }
        this.$emit('input', value)
      },
    },
  },

  mounted: function () {
    document.documentElement.classList.add('overflow-y-hidden')
  },
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
