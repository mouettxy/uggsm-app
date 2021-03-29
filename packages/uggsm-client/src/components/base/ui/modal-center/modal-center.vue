<template lang="pug">
v-dialog.ug-modal-center(
  v-model='model',
  :fullscreen='isMobile',
  :eager='eager',
  :content-class='contentClass',
  width='50vw',
  transition='dialog-bottom-transition',
  persistent,
  overlay-opacity='0.8'
)
  template(#activator='{on, attrs}')
    slot(
      name='activator',
      :on='on',
      :attrs='attrs'
    )
  v-card.ug-modal-center__card
    slot(:close='closeModal')
</template>

<script>
import Responsive from '@/mixins/responsive'

export default {
  name: 'ug-modal-center',

  mixins: [Responsive],

  props: {
    value: {
      required: false,
      type: [Boolean],
    },

    contentClass: {
      required: false,
      type: [String],

      default: 'center-modal',
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

  methods: {
    closeModal() {
      this.model = false
    },
  },
}
</script>

<style lang="sass">
.ug-modal-center__card
  height: 100%
</style>
