<template lang="pug">
ug-responsive-menu.ug-table-select
  template(#activator='{on, attrs}')
    ug-base-chip(
      v-on='on',
      v-bind='attrs',
      small
    ) {{ itemText || label }}
  v-list(dense)
    template(v-for='item in items')
      v-list-item(
        v-if='item.value !== model',
        :key='`item-${item.value}`',
        @click='handleListClick(item.value)'
      )
        v-list-item-content
          v-list-item-title {{ item.text }}
</template>

<script>
import UgResponsiveMenu from '@/components/base/ui/responsive-menu/responsive-menu'
import UgBaseChip from '@/components/base/ui/base-chip/base-chip'

import { find } from 'lodash'

export default {
  name: 'ug-table-select',

  components: {
    UgResponsiveMenu,
    UgBaseChip,
  },

  props: {
    value: {
      required: false,
      type: String,
      default: '',
    },

    items: {
      required: false,
      type: Array,
      default: () => [],
    },

    label: {
      required: false,
      type: String,
      default: 'Выберите элемент',
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

    itemText() {
      return find(this.items, { value: this.model })?.text
    },
  },

  methods: {
    handleListClick(value) {
      this.model = value

      this.$emit('change', value)
    },
  },
}
</script>
