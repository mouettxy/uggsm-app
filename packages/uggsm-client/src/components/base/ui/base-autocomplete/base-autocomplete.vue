<template lang="pug">
v-autocomplete.ug-base-autocomplete(
  v-model='model',
  :search-input.sync='query',
  :return-object='returnObject',
  :prepend-inner-icon='icon',
  :menu-props='{ allowOverflow: true, bottom: true, maxHeight: 204 }',
  :label='label',
  :items='items',
  :item-value='itemValue',
  :item-text='itemText',
  :hide-details='hideDetails',
  :disabled='disabled',
  :dense='dense',
  @update:search-input='onChange',
  @focus.stop='onAutocompleteFocus',
  @blur.stop='onBlur',
  v-mask='phoneMask',
  outlined,
  no-filter,
  no-data-text='Нет доступных данных',
  hide-no-data,
  clearable,
  auto-select-first
)
</template>

<script>
import { VueMaskFilter } from 'v-mask'

export default {
  name: 'ug-base-autocomplete',
  props: {
    value: {
      required: true,
      type: [String, Number, Object],
    },

    disabled: {
      required: false,
      type: [Boolean],
    },

    uriQuery: {
      required: false,
      type: [Object],
    },

    label: {
      required: false,
      type: [String],
    },

    replaceSearchWith: {
      required: false,
      type: [String],
    },

    dense: {
      required: false,
      type: [Boolean],
    },

    icon: {
      required: false,
      type: [String],
    },

    predefinedItems: {
      required: false,
      type: [Array],
    },

    returnObject: {
      required: false,
      type: [Boolean],
    },

    hideDetails: {
      required: false,
      type: [Boolean],
    },

    disallowFreeType: {
      required: false,
      type: [Boolean],
    },

    phone: {
      required: false,
      type: [Boolean],
    },

    itemText: {
      required: false,
      type: [String],
      default: 'text',
    },

    itemValue: {
      required: false,
      type: [String],
      default: 'value',
    },
  },
  data: function () {
    return {
      items: [],
      query: '',
      allowItemsFetch: false,
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

    phoneMask() {
      if (this.phone) {
        return '+7 (###) ###-##-##'
      } else {
        return false
      }
    },
  },
  methods: {
    async onChange() {
      if (this.query && this.allowItemsFetch) {
        const items = await this.getItems()

        this.items = items

        if (this.phone) {
          this.items = this.items.map(this.items, (e) => ({
            value: e.value,
            text: VueMaskFilter(e.text, '+7 (###) ###-##-##'),
          }))
        }

        if (!this.disallowFreeType) {
          this.items.push({ value: this.query, text: this.query })
        }
      }
    },

    async onAutocompleteFocus() {
      this.allowItemsFetch = true
      this.items = await this.getItems()
    },

    async getItems() {
      try {
        let params = {
          search: this.query,
        }

        if (this.uriQuery) {
          params = {
            ...params,
            ...this.uriQuery,
          }
        }

        if (this.replaceSearchWith) {
          params.search = this.replaceSearchWith
        }

        const response = await this.$axios.get(`autocomplete${this.endpoint}`, { params })

        if (response.status === 200) {
          return response.data
        } else {
          return []
        }
      } catch (e) {
        return []
      }
    },

    onBlur() {
      this.allowItemsFetch = false
      if (!this.disallowFreeType && !this.returnObject) {
        this.model = this.query
      }
    },
  },
  mounted: function () {
    if (this.predefinedItems) {
      this.items = this.predefinedItems
    }
  },
}
</script>
