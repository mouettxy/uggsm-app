<template lang="pug">
v-autocomplete(
  v-model='model',
  :label='label',
  :items='items',
  :search-input.sync='query',
  :dense='dense',
  :return-object='returnObject',
  :prepend-inner-icon='icon',
  @focus.stop='onAutocompleteFocus',
  item-text='text',
  item-value='value',
  outlined,
  hide-no-data,
  clearable,
  auto-select-first,
  no-data-text='Нет доступных данных'
)
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

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
  @Prop(Boolean) returnObject!: boolean

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
        search: this.query,
      }

      if (this.replaceSearchWith) {
        params.search = this.replaceSearchWith
      }

      const response = await this.$axios.get(`autocomplete${this.endpoint}`, { params: params })
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
