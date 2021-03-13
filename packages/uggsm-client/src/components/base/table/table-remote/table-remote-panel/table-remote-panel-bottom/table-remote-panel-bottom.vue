<template lang="pug">
.ug-table-remote-panel-bottom
  template(v-if='!isMobile')
    v-row.ug-table-remote-panel-bottom--wrap(
      no-gutters,
      align='center'
    )
      v-col.ug-table-remote-panel-bottom__search(
        cols='12',
        md='3',
        lg='3'
      )
        ug-table-remote-search(v-model='searchModel')
      v-col.ug-table-remote-panel-bottom__display-filters(
        cols='12',
        md='5',
        lg='5'
      )

      v-col.ug-table-remote-panel-bottom__custom-filter.d-flex.align-center.justify-end(
        cols='12',
        md='4',
        lg='4'
      )
        ug-table-remote-btn(
          label='Сохраненные фильтры',
          icon='mdi-filter-plus'
        )

        .ug-table-remote-panel-bottom__vertical-delimeter
          .ug-table-remote-panel-bottom__vertical-delimeter--inner

        ug-table-remote-btn(
          label='Управление фильтром',
          icon='mdi-filter-menu'
        )
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
  .ug-table-remote-panel-bottom__vertical-delimeter
    height: 16px
    display: inline-block
    width: 1px
    margin: 0 8px
    .ug-table-remote-panel-bottom__vertical-delimeter--inner
      background: var(--v-table_darkgrey-base)
      height: 100%
  .ug-table-remote-panel-bottom--wrap
    display: flex
    align-items: center
</style>
