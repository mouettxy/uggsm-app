<template lang="pug">
v-dialog.ug-modal-fullscreen(
  v-model='model',
  transition='ug-dialog-bottom-transition',
  internal-activator,
  fullscreen
)
  template(#activator='{on, attrs}')
    slot(
      name='activator',
      :on='on',
      :attrs='attrs'
    )
  v-card.ug-modal-fullscreen__card
    slot
</template>

<script>
export default {
  name: 'ug-modal-fullscreen',

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
        this.$emit('input', value)
      },
    },
  },
}
</script>

<style lang="sass">
.v-dialog.ug-modal-fullscreen
  height: 100%

.ug-modal-fullscreen__card
  height: 100%
</style>
