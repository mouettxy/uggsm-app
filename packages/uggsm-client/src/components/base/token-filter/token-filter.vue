<template lang="pug">
v-slide-x-transition.ug-token-filter(
  tag='div',
  group,
  appear
)
  ug-token-filter-entry(
    v-for='(filterEntry, filterEntryIndex) in filter',
    :key='filterEntry.token.value + "_" + filterEntryIndex',
    :filter-index='filterEntryIndex',
    :filter-entry='filterEntry',
    @update-filter='handleUpdateFilter',
    @enable-filter='handleEnableFilter',
    @disable-filter='handleDisableFilter',
    @delete-filter='handleDeleteFilter'
  )
  ug-token-filter-add(
    key='token-add',
    :tokens='uniqueTokens',
    @add-filter='handleAddFilter'
  )
</template>

<script>
import UgTokenFilterEntry from './token-filter-entry/token-filter-entry'
import UgTokenFilterAdd from './token-filter-add/token-filter-add'
import { addToStorage, getFromStorage } from '@/api/helpers/storageManager'

export default {
  name: 'ug-token-filter',

  components: {
    UgTokenFilterEntry,
    UgTokenFilterAdd,
  },

  props: {
    tokens: {
      required: false,
      type: Array,
      default: () => [],
    },

    cache: {
      required: false,
      type: String,
      default: '',
    },

    defaultFilters: {
      required: false,
      type: Array,
      default: () => [],
    },

    savedFilter: {
      required: true,
      type: String,
    },
  },

  data: function () {
    return {
      filter: [],
    }
  },

  computed: {
    savedFilterPath() {
      return {
        default: this.savedFilter + '-filter' + '.default',
        custom: this.savedFilter + '-filter' + '.custom',
        current: this.savedFilter + '-filter' + '.current',
      }
    },

    uniqueTokens() {
      const uniqueTokensInFilter = this.filter.filter((e) => e.token.unique).map((e) => e.token.value)

      return this.tokens.filter((e) => !uniqueTokensInFilter.includes(e.value))
    },
  },

  watch: {
    filter: function (value) {
      this.$emit('update', value)

      addToStorage(this.savedFilterPath.current, value)
    },

    defaultFilters: function (value) {
      addToStorage(this.savedFilterPath.default, this.defaultFilters)
    },
  },

  mounted: function () {
    this.initStorage()
  },

  methods: {
    /* --------------------------------- /PUBLIC --------------------------------- */
    disableAll() {
      for (const index in this.filter) {
        const filter = this.filter[index]

        this.$set(this.filter, index, {
          ...filter,
          disabled: true,
        })
      }
    },

    enableAll() {
      for (const index in this.filter) {
        const filter = this.filter[index]

        this.$set(this.filter, index, {
          ...filter,
          disabled: false,
        })
      }
    },

    getSavedFilters(type = '') {
      if (!type) {
        const defaultFilter = getFromStorage(this.savedFilterPath.default) || []
        const customFilter = getFromStorage(this.savedFilterPath.custom) || []

        return [...defaultFilter, ...customFilter]
      }

      if (type === 'default') {
        return getFromStorage(this.savedFilterPath.default) || []
      }

      if (type === 'custom') {
        return getFromStorage(this.savedFilterPath.custom) || []
      }
    },

    getSavedFilterAutocomplete() {
      return this.getSavedFilters().map((e) => ({ text: e.name, value: e.name }))
    },

    getSavedFilter(name) {
      const filters = this.getSavedFilters()

      return filters.find((e) => e.name === name)
    },

    createSavedFilter(name) {
      const filters = this.getSavedFilters()

      if (filters.find((e) => e.name === name)) {
        return false
      }

      const customFilter = this.getSavedFilters('custom')
      addToStorage(this.savedFilterPath.custom, [
        ...customFilter,
        {
          name,
          filter: getFromStorage(this.savedFilterPath.current),
        },
      ])
      return true
    },

    setSavedFilter(name) {
      const savedFilter = this.getSavedFilter(name)

      if (!savedFilter) {
        return false
      }

      this.filter = savedFilter.filter
      return true
    },

    removeSavedFilter(name) {
      const customFilter = this.getSavedFilters('custom')

      addToStorage(
        this.savedFilterPath.custom,
        customFilter.filter((e) => e.name !== name)
      )
    },

    /* --------------------------------- \PUBLIC -------------------------------- */

    initStorage() {
      addToStorage(this.savedFilterPath.default, this.defaultFilters)

      if (!getFromStorage(this.savedFilterPath.custom)) {
        addToStorage(this.savedFilterPath.custom, [])
      }

      const lastFilter = getFromStorage(this.savedFilterPath.current)
      if (lastFilter) {
        this.extendFilterWith(lastFilter)
      }
    },

    handleEnableFilter(index) {
      const filter = this.filter[index]

      this.$set(this.filter, index, {
        ...filter,
        disabled: false,
      })
    },

    handleDisableFilter(index) {
      const filter = this.filter[index]

      this.$set(this.filter, index, {
        ...filter,
        disabled: true,
      })
    },

    handleDeleteFilter(index) {
      this.$delete(this.filter, index)
    },

    handleUpdateFilter(filter, index) {
      this.$set(this.filter, index, filter)
    },

    handleAddFilter(filter) {
      this.filter.push(filter)
    },

    extendFilterWith(extend) {
      this.filter = [...this.filter, ...extend]
    },
  },
}
</script>

<style lang="sass">
.ug-token-filter
  display: flex
  gap: 4px
  flex-wrap: wrap
</style>
