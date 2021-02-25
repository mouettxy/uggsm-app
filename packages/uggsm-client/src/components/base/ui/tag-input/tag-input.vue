<template lang="pug">
v-combobox(
  v-model.sync='model',
  :search-input='search',
  :label='label',
  :items='items',
  :hide-details='hideDetails',
  small-chips,
  outlined,
  multiple,
  hide-selected,
  dense
)
</template>

<script>
export default {
  name: 'ug-tag-input',
  props: {
    label: {
      required: false,
      type: String,
    },
    value: {
      required: true,
      type: [Array, String],
    },
    items: {
      required: false,
      type: [Array],
    },
    hideDetails: {
      required: false,
      type: [String, Boolean],
    },
  },
  data: function () {
    return {
      search: '',
    }
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
