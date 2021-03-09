<template lang="pug">
v-switch.ug-base-switch(
  v-model='model',
  :prepend-icon='icon',
  :label='label',
  :hide-details='hideDetails',
  :flat='flat',
  :disabled='disabled',
  :dense='dense',
  :color='color'
)
  template(#label)
    slot(name='label')
</template>

<script>
export default {
  name: 'ug-base-switch',

  props: {
    value: {
      required: false,
      type: [Boolean],
    },

    label: {
      required: false,
      type: [String],
      default: '',
    },

    dense: {
      required: false,
      type: [Boolean],
    },

    flat: {
      required: false,
      type: [Boolean],
    },

    icon: {
      required: false,
      type: [String],
      default: '',
    },

    color: {
      required: false,
      type: [String],
      default: '',
    },

    disabled: {
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
