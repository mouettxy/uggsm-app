<template lang="pug">
.ug-table-remote-panel-bottom
  template(v-if='!isMobile')
    v-row.ug-table-remote-panel-bottom--wrap(no-gutters)
      v-col.ug-table-remote-panel-bottom__search(
        cols='12',
        md='3',
        lg='3'
      )
        ug-table-remote-search(v-model='searchModel')
      v-col.ug-table-remote-panel-bottom__display-filters(
        cols='12',
        md='3',
        lg='3'
      )
        span predefined filtersasd
      v-col.ug-table-remote-panel-bottom__saved-filters(
        cols='12',
        md='3',
        lg='3'
      )
        span saved-filters
      v-col.ug-table-remote-panel-bottom__custom-filter(
        cols='12',
        md='3',
        lg='3'
      )
        span custom filter
</template>

<script>
import Responsive from '@/mixins/responive'
import UgTableRemoteSearch from './../../table-remote-search/table-remote-search'

export default {
  name: 'ug-table-remote-panel-bottom',

  components: {
    UgTableRemoteSearch,
  },

  mixins: [Responsive],

  props: {
    search: {
      required: true,
      type: String,
    },
  },

  computed: {
    searchModel: {
      get: function () {
        return this.search
      },

      set: function (value) {
        this.$emit('update:search', value)
      },
    },
  },
}
</script>

<style lang="sass">
.ug-table-remote-panel-bottom
  padding: 0 12px
  .ug-table-remote-panel-bottom--wrap
    display: flex
    align-items: center
</style>
