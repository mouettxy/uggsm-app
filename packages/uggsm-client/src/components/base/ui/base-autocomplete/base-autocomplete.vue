<template lang="pug">
v-autocomplete.ug-base-autocomplete(
  v-model='model',
  :search-input.sync='query',
  :return-object='returnObject',
  :prepend-inner-icon='icon',
  :menu-props='{ allowOverflow: true, bottom: true, maxHeight: 204 }',
  :label='label',
  :items='prettifiedItems',
  :item-value='itemValue',
  :item-text='itemText',
  :hide-details='hideDetails',
  :disabled='disabled',
  @update:search-input='onChange',
  @focus.stop='onAutocompleteFocus',
  @blur.stop='onBlur',
  v-mask='phoneMask',
  outlined,
  no-filter,
  no-data-text='Нет доступных данных',
  hide-no-data,
  dense,
  clearable,
  auto-select-first,
  append-icon=''
)
</template>

<script>
import { VueMaskFilter } from 'v-mask'
import { debounce } from 'lodash'

export default {
  name: 'ug-base-autocomplete',
  props: {
    value: {
      required: false,
      type: [String, Number, Object],
      default: '',
    },

    endpoint: {
      required: true,
      type: [String],
    },

    disabled: {
      required: false,
      type: [Boolean],
    },

    uriQuery: {
      required: false,
      type: [Object],
      default: () => ({}),
    },

    label: {
      required: false,
      type: [String],
      default: '',
    },

    replaceSearchWith: {
      required: false,
      type: [String],
      default: '',
    },

    icon: {
      required: false,
      type: [String],
      default: '',
    },

    predefinedItems: {
      required: false,
      type: [Array],
      default: () => [],
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

    querySearch: {
      required: false,
      type: String,
      default: 'search',
    },
  },

  data: function () {
    return {
      items: [],
      query: '',
      allowItemsFetch: false,
      timeout: 500,
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

    debouncedGetItems() {
      return debounce(this.getItems, this.timeout)
    },

    prettifiedItems() {
      if (this.phone && this.items) {
        const tempItems = []
        this.items.forEach((e) => {
          tempItems.push({
            value: e.value,
            text: VueMaskFilter(e.text, '+7 (###) ###-##-##'),
          })
        })

        if (!this.disallowFreeType && this.query) {
          tempItems.push({ value: this.query, text: VueMaskFilter(this.query, '+7 (###) ###-##-##') })
        }

        return tempItems
      } else if (!this.disallowFreeType) {
        return this.items
      }

      return this.items
    },

    phoneMask() {
      if (this.phone) {
        return '+7 (###) ###-##-##'
      }

      return false
    },
  },

  mounted: function () {
    if (this.predefinedItems) {
      this.items = this.predefinedItems
    }
  },

  methods: {
    async onChange() {
      if (this.query && this.allowItemsFetch) {
        await this.debouncedGetItems()
      }
    },

    async onAutocompleteFocus() {
      this.allowItemsFetch = true
      await this.getItems()
    },

    async getItems(modifyItemsFn) {
      try {
        let params = {
          [this.querySearch]: this.query,
        }

        if (this.uriQuery) {
          params = {
            ...params,
            ...this.uriQuery,
          }
        }

        if (this.replaceSearchWith) {
          params[this.querySearch] = this.replaceSearchWith
        }

        //!FIXME: axios call in component
        const response = await this.$axios.get(`autocomplete${this.endpoint}`, { params })

        if (response.status !== 200) {
          this.items = []
          return
        }

        let items = response.data

        if (modifyItemsFn && typeof modifyItemsFn === 'function') {
          items = modifyItemsFn(items)
        }

        this.items = items
      } catch (e) {
        this.items = []
      }
    },

    onBlur() {
      this.allowItemsFetch = false
      if (!this.disallowFreeType && !this.returnObject) {
        this.model = this.query
      }
    },
  },
}
</script>
