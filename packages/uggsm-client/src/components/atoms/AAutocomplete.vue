<template lang="pug">
v-autocomplete(
  v-model='model',
  :search-input.sync='query',
  :return-object='returnObject',
  :prepend-inner-icon='icon',
  :menu-props='{ allowOverflow: true, bottom: true, maxHeight: 204 }',
  :label='label',
  :items='items',
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
  item-value='value',
  item-text='text',
  hide-no-data,
  clearable,
  auto-select-first
)
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

import { isEmpty, map } from 'lodash'

import { VueMaskFilter } from 'v-mask'

@Component
export default class AAutocomplete extends Vue {
  @Prop({ type: [String, Object, Number] }) value: any
  @Prop({ type: Boolean, default: false }) disabled!: boolean
  @Prop({ type: Object }) uriQuery!: Record<string, any>
  @Prop(String) label: any
  @Prop(String) endpoint: any
  @Prop(String) replaceSearchWith: any
  @Prop(Boolean) dense: any
  @Prop(String) icon: any
  @Prop(Array) predefinedItems: any
  @Prop(Boolean) returnObject!: boolean
  @Prop(Boolean) hideDetails!: boolean
  @Prop(Boolean) disallowFreeType!: boolean
  @Prop(Boolean) phone!: boolean

  public items: Array<any> = []
  public query = ''
  public allowItemsFetch = false

  async onChange() {
    if (this.query && this.allowItemsFetch) {
      const items = await this.getItems()

      this.items = items

      if (this.phone) {
        this.items = map(this.items, (e) => {
          return {
            value: e.value,
            text: VueMaskFilter(e.text, '+7 (###) ###-##-##'),
          }
        })
      }

      if (!this.disallowFreeType) {
        this.items.push({ value: this.query, text: this.query })
      }
    }
  }

  get phoneMask() {
    if (this.phone) {
      return '+7 (###) ###-##-##'
    } else {
      return false
    }
  }

  async onAutocompleteFocus() {
    this.allowItemsFetch = true
    this.items = await this.getItems()
  }

  get model() {
    return this.value
  }

  set model(value) {
    this.$emit('input', value)
  }

  onBlur() {
    this.allowItemsFetch = false
    if (!this.disallowFreeType && !this.returnObject) {
      this.model = this.query
    }
  }

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
  }

  mounted() {
    if (this.predefinedItems) {
      this.items = this.predefinedItems
    }
  }
}
</script>
