<template lang="pug">
v-textarea.ug-base-textare(
  v-model='model',
  :rules='validate',
  :prepend-inner-icon='icon',
  :label='label',
  :hide-details='hideDetails ? "auto" : false',
  :dense='dense',
  :hint='hint',
  validate-on-blur,
  rows='2',
  outlined,
  no-resize,
  clearable,
  auto-grow
)
</template>

<script>
export default {
  name: 'ug-base-textarea',

  props: {
    value: {
      required: false,
      type: [String, Number],
      default: '',
    },

    icon: {
      required: false,
      type: [String],
      default: '',
    },

    label: {
      required: false,
      type: [String],
      default: '',
    },

    hint: {
      required: false,
      type: [String],
      default: '',
    },

    validate: {
      required: false,
      type: [Array],
      default: () => [],
    },

    dense: {
      required: false,
      type: [Boolean],
    },

    hideDetails: {
      required: false,
      type: [String],

      default: 'auto',
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
