<template lang="pug">
v-select.ug-base-select(
  v-model='model',
  :smallChips='smallChips',
  :single-line='singleLine',
  :readonly='readonly',
  :prepend-inner-icon='icon',
  :multiple='multiple',
  :label='label',
  :items='items',
  :hideSelected='hideSelected',
  :disabled='disabled',
  :deletableChips='deletableChips',
  :clearable='clearable',
  :chips='chips',
  :hint='hint',
  @change='onChange',
  outlined,
  hide-details='auto',
  dense
)
  template(#selection='{item, index}')
    slot(
      name='selection',
      :item='item',
      :index='index'
    )
      template(v-if='typeof item === "string"')
        span {{ item }}
      template(v-else)
        span {{ item["text"] }}
</template>

<script>
export default {
  name: 'ug-base-select',
  props: {
    value: {
      required: true,
      type: [String, Array],
    },

    items: {
      required: false,
      type: [Array],
    },

    icon: {
      required: false,
      type: [String],
    },

    label: {
      required: false,
      type: [String],
    },

    hint: {
      required: false,
      type: [String],
    },

    cache: {
      required: false,
      type: [String],
    },

    readonly: {
      required: false,
      type: [Boolean],
    },

    multiple: {
      required: false,
      type: [Boolean],
    },

    chips: {
      required: false,
      type: [Boolean],
    },

    smallChips: {
      required: false,
      type: [Boolean],
    },

    hideSelected: {
      required: false,
      type: [Boolean],
    },

    deletableChips: {
      required: false,
      type: [Boolean],
    },

    clearable: {
      required: false,
      type: [Boolean],
    },

    singleLine: {
      required: false,
      type: [Boolean],
    },

    disabled: {
      required: false,
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

        if (this.cache) {
          localStorage.setItem(this.cache, JSON.stringify(value))
        }
      },
    },
  },

  methods: {
    onChange() {
      this.$emit('change', this.model)
    },
  },

  mounted: function () {
    if (this.cache) {
      const cached = localStorage.getItem(this.cache)

      if (cached) {
        const items = JSON.parse(cached)
        this.model = items
        this.$emit('change', items)
      }
    }
  },
}
</script>

<style lang="sass">
.ug-base-select
  .v-select__selections
    input
      max-width: 20px
</style>
