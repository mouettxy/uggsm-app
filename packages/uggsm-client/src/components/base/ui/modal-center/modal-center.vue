<template lang="pug">
v-dialog.ug-modal-center(
  v-model='model',
  :fullscreen='this.$vuetify.breakpoint.mobile',
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
  slot(:close='closeModal')
</template>

<script>
export default {
  name: 'ug-modal-center',

  props: {
    value: {
      required: true,
      type: [Boolean],
    },

    contentClass: {
      required: false,
      type: [String],

      default: 'center-modal',
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
