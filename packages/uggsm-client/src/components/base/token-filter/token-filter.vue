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
  ug-base-chip(
    key='token-delete',
    v-if='filter.length',
    @click='handleClearFilter',
    color='#ddd'
  )
    v-icon mdi-close
</template>

<script>
import UgTokenFilterEntry from './token-filter-entry/token-filter-entry'
import UgTokenFilterAdd from './token-filter-add/token-filter-add'
import UgBaseChip from '@/components/base/ui/base-chip/base-chip'

import { mapActions, mapState } from 'vuex'

export default {
  name: 'ug-token-filter',

  components: {
    UgTokenFilterEntry,
    UgTokenFilterAdd,
    UgBaseChip,
  },

  props: {
    tokens: {
      required: false,
      type: Array,
      default: () => [],
    },

    type: {
      required: false,
      type: String,
      default: '',
    },
  },

  computed: {
    ...mapState({
      filterList: (state) => state.filters.filterList,
    }),

    filter: {
      get: function () {
        return this.filterList[this.type].current
      },

      set: function (data) {
        this.$emit('update', data)

        this.vuexAddCurrentFilter({
          name: this.type,
          data,
        })
      },
    },

    uniqueTokens() {
      const uniqueTokensInFilter = this.filter.filter((e) => e.token.unique).map((e) => e.token.value)

      return this.tokens.filter((e) => !uniqueTokensInFilter.includes(e.value))
    },
  },

  mounted: function () {
    this.initFilter()
  },

  methods: {
    ...mapActions({
      vuexInitDefaultFilter: 'filters/initDefaultFilter',
      vuexAddCurrentFilter: 'filters/addCurrent',
      vuexRemoveCurrentFilter: 'filters/removeCurrent',
    }),

    /* --------------------------------- /PUBLIC --------------------------------- */
    disableAll() {
      for (const index in this.filter) {
        const filter = this.filter[index]

        this.$set(this.filter, index, {
          ...filter,
          disabled: true,
        })

        this.filter = [...this.filter]
      }
    },

    enableAll() {
      for (const index in this.filter) {
        const filter = this.filter[index]

        this.$set(this.filter, index, {
          ...filter,
          disabled: false,
        })

        this.filter = [...this.filter]
      }
    },

    /* --------------------------------- \PUBLIC -------------------------------- */

    initFilter() {
      this.vuexInitDefaultFilter(this.type)
    },

    handleClearFilter() {
      this.vuexRemoveCurrentFilter({
        name: this.type,
      })
    },

    handleEnableFilter(index) {
      const filter = this.filter[index]

      this.$set(this.filter, index, {
        ...filter,
        disabled: false,
      })

      this.filter = [...this.filter]
    },

    handleDisableFilter(index) {
      const filter = this.filter[index]

      this.$set(this.filter, index, {
        ...filter,
        disabled: true,
      })

      this.filter = [...this.filter]
    },

    handleDeleteFilter(index) {
      this.$delete(this.filter, index)

      this.filter = [...this.filter]
    },

    handleUpdateFilter(filter, index) {
      this.$set(this.filter, index, filter)

      this.filter = [...this.filter]
    },

    handleAddFilter(filter) {
      this.filter = [...this.filter, filter]
    },
  },
}
</script>

<style lang="sass">
.ug-token-filter
  overflow-x: auto
  display: flex
  gap: 4px
  flex-wrap: wrap
</style>
