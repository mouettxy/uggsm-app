<template lang="pug">
v-dialog.ug-modal-right(
  v-model='model',
  :fullscreen='isMobile',
  :eager='eager',
  :content-class='`right-modal${isMobile ? " is-mobile" : ""}`',
  transition='ug-dialog-right-transition'
)
  template(#activator='{on, attrs}')
    slot(
      name='activator',
      :on='on',
      :attrs='attrs'
    )
  v-card.ug-modal-right__card
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

    eager: {
      required: false,
      type: Boolean,
    },
  },

  computed: {
    model: {
      get: function () {
        return this.value
      },

      set: function (value) {
        this.$emit('input', value)
      },
    },
  },

  watch: {
    model: {
      immediate: true,
      handler: function (value) {
        if (this.isMobile) {
          if (!value) {
            document.documentElement.classList.remove('overflow-y-hidden')
          } else {
            document.documentElement.classList.add('overflow-y-hidden')
          }
        }
      },
    },
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
  max-height: 100% !important
  border-radius: 0px !important
  margin: 0
  &.is-mobile
    width: 100% !important
    left: 0

  .ug-modal-right__card
    height: 100%
    overflow-y: auto
</style>
