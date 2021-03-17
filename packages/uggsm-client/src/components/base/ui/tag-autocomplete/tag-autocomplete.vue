<template lang="pug">
v-autocomplete(
  v-model='model',
  :search-input.sync='search',
  :return-object='returnObject',
  :label='label',
  :items='items',
  :item-value='itemValue',
  :item-text='itemText',
  :hide-details='true',
  @input='handleInput',
  small-chips,
  outlined,
  no-data-text='Нет данных',
  multiple,
  hide-selected,
  dense,
  deletable-chips,
  auto-select-first,
  append-icon=''
)
</template>

<script>
import axios from '@/plugins/axios'

export default {
  name: 'ug-tag-autocomplete',
  props: {
    label: {
      required: false,
      type: String,
      default: '',
    },

    value: {
      required: false,
      type: [Array, String],
      default: '',
    },

    path: {
      required: false,
      type: String,
      default: '',
    },

    fetchOnMount: {
      required: false,
      type: Boolean,
    },

    itemText: {
      required: false,
      type: String,
      default: 'text',
    },

    itemValue: {
      required: false,
      type: String,
      default: 'value',
    },

    returnObject: {
      required: false,
      type: Boolean,
    },
  },

  data: function () {
    return {
      search: null,
      items: [],
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

    endpoint() {
      return `/autocomplete${this.path}`
    },
  },

  watch: {
    search: function (value) {
      this.getItems(value)
    },
  },

  mounted: function () {
    if (this.fetchOnMount) {
      this.getItems('')
    }
  },

  methods: {
    async fetchEndpoint(search) {
      const apiResponse = await axios.request({
        url: this.endpoint,
        method: 'get',
        params: {
          search: search,
        },
      })

      if (!(apiResponse.status === 200)) {
        return []
      }

      return apiResponse.data
    },

    async getItems(value) {
      this.items = await this.fetchEndpoint(value)
    },

    handleInput() {
      this.search = null
    },
  },
}
</script>
