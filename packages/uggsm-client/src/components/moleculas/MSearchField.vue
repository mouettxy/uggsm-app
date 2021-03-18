<template>
  <div class="search-field">
    <v-text-field
      v-model="value"
      clearable
      dense
      hide-details
      label="Поиск"
      outlined
      prepend-inner-icon="mdi-magnify"
      single-line
    ></v-text-field>
  </div>
</template>

<script>
import { settingsModule } from '@/store'
import { debounce } from 'lodash'

export default {
  name: 'm-search-field',

  props: {
    type: {
      required: true,
      type: String,
    },
  },

  data: () => ({
    value: '',
    debounced: debounce(settingsModule.setSearch, 300),
  }),

  watch: {
    value: function (value) {
      this.debounced({ search: value, type: this.type })
    },
  },

  async beforeDestroy() {
    await settingsModule.setSearch({ search: '', type: this.type })
  },
}
</script>
