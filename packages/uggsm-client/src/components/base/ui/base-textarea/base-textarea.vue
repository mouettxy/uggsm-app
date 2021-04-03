<template>
  <v-textarea
    v-model="model"
    class="ug-base-textare"
    :rules="validate"
    :prepend-inner-icon="icon"
    :label="label"
    :hide-details="hideDetails ? 'auto' : false"
    :dense="dense"
    :hint="hint"
    :persistent-hint="persistentHint"
    validate-on-blur
    rows="2"
    outlined
    no-resize
    clearable
    auto-grow
  >
    <template #message>
      <slot name="message"></slot>
    </template>
  </v-textarea>
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

    persistentHint: {
      required: false,
      type: Boolean,
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
