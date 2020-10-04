<template lang="pug">
v-autocomplete(
  v-model='model',
  :search-input.sync='query',
  :label='label',
  :dense='dense',
  @focus.stop='onAutocompleteFocus',
  outlined,
  item-text='text',
  item-value='value',
  hide-no-data,
  :items='items',
  clearable,
  auto-select-first,
  no-data-text='Нет доступных данных',
  :prepend-inner-icon='icon'
)
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

import axios from '@/plugins/axios'
import { isEmpty } from 'lodash'

@Component
export default class AAutocomplete extends Vue {
  @Prop(String) value: any
  @Prop(String) label: any
  @Prop(String) endpoint: any
  @Prop(String) replaceSearchWith: any
  @Prop(Boolean) dense: any
  @Prop(String) icon: any
  @Prop(Array) predefinedItems: any

  public items: Array<any> = []
  public query = ''

  @Watch('query')
  async onValueChange() {
    if (this.query) {
      const items = await this.getItems()

      if (isEmpty(items)) {
        this.items.push({ value: this.query, text: this.query })
      }
    }
  }

  async onAutocompleteFocus() {
    this.items = await this.getItems()
  }

  get model() {
    return this.value
  }

  set model(value) {
    this.$emit('input', value)
  }

  async getItems() {
    try {
      const params = {
        search: this.query
      }

      if (this.replaceSearchWith) {
        params.search = this.replaceSearchWith
      }

      const response = await axios.get(`autocomplete${this.endpoint}`, { params: params })
      if (response.status === 200) {
        return response.data
      } else {
        return []
      }
    } catch (e) {
      return []
    }
  }

  mounted() {
    if (this.predefinedItems) {
      this.items = this.predefinedItems
    }
  }
}
</script>
