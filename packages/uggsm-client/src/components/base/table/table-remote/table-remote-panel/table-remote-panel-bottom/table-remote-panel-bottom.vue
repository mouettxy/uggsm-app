<template lang="pug">
.ug-table-remote-panel-bottom
  v-row.ug-table-remote-panel-bottom--wrap(
    no-gutters,
    justify='space-between',
    align='center'
  )
    v-col(
      cols='12',
      md='3',
      lg='3'
    )
      v-row.mr-2.mr-lg-0.mr-md-0(
        no-gutters,
        align='center'
      )
        v-col(
          cols='6',
          sm='10',
          md='10',
          lg='10'
        )
          ug-table-remote-search(v-model='searchModel')
        v-col(
          cols='6',
          sm='2',
          md='2',
          lg='2'
        )
          ug-table-remote-btn.ml-2(
            :label='isMobile ? "Сброс" : "Сброс фильтра"',
            :block='isMobile',
            icon='mdi-filter-remove'
          )
    v-col.mt-2.mt-lg-0.mt-md-0(
      cols='12',
      md='auto',
      lg='auto'
    )
      v-row(
        no-gutters,
        justify='space-between',
        align='center'
      )
        v-col(
          cols='5',
          md='auto',
          lg='auto'
        )
          ug-table-remote-btn(
            :label='isMobile ? "Мои" : "Мои фильтры"',
            :block='isMobile',
            icon='mdi-filter-plus'
          )
        v-col.text-center(cols='auto')
          .ug-table-remote-panel-bottom__vertical-delimeter(
            :class='{ "ug-table-remote-panel-bottom__vertical-delimeter--mobile": isMobile }'
          )
            .ug-table-remote-panel-bottom__vertical-delimeter--inner
        v-col(
          cols='5',
          md='auto',
          lg='auto'
        )
          ug-table-remote-btn(
            :label='isMobile ? "Фильтры" : "Управление фильтром"',
            :block='isMobile',
            icon='mdi-filter-menu'
          )
</template>

<script>
import Responsive from '@/mixins/responsive'
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
    width: 1px
    margin: 0 8px
    &--mobile
      margin: 0 auto
    .ug-table-remote-panel-bottom__vertical-delimeter--inner
      background: var(--v-table_darkgrey-base)
      height: 100%
  .ug-table-remote-panel-bottom--wrap
    display: flex
    align-items: center
</style>
