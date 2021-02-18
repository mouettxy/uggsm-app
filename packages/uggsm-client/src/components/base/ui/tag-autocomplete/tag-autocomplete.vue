<template lang="pug">
v-autocomplete(
  v-model='model',
  :search-input.sync='search',
  :label='label',
  :items='items',
  :item-value='itemValue',
  :item-text='itemText',
  :hide-details='true',
  @input='handleInput',
  small-chips,
  prepend-inner-icon='mdi-magnify',
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

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

import axios from '@/plugins/axios'

@Component
export default class UgTagAutocomplete extends Vue {
  @Prop() label!: string
  @Prop() value!: Array<string> | string

  @Prop({ required: true }) path!: string

  @Prop({ default: 'text' }) itemText!: string
  @Prop({ default: 'value' }) itemValue!: string

  public search = null

  public items = []

  get endpoint() {
    return `/autocomplete${this.path}`
  }

  @Watch('search')
  async onSearchChange(value: string) {
    this.items = await this.fetchEndpoint(value)
  }

  async fetchEndpoint(search: string) {
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
  }

  get model() {
    return this.value
  }

  set model(value: Array<string> | string) {
    this.$emit('input', value)
  }

  handleInput(value: any) {
    console.log(value)

    this.search = null
  }
}
</script>

<style lang="sass"></style>
