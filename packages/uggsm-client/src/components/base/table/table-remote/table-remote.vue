<template lang="pug">
.ug-table-remote
  ug-table-remote-panel(
    ref='topPanel',
    :search.sync='search',
    :include-office-field='includeOfficeField',
    :headers.sync='headers',
    v-intersect.quiet='handleTopPanelIntersect'
  )

  v-slide-y-transition
    v-row.ug-table-remote__meta(
      v-if='items',
      no-gutters,
      justify='space-between'
    )
      v-col(
        cols='12',
        md='auto',
        lg='auto'
      )
        span.
          Результаты
          #[strong {{ items.page * items.limit - items.limit + 1 }}] -
          #[strong {{ items.page * items.limit }}] из
          #[strong {{ serverItems }}]
      v-col(
        cols='12',
        md='auto',
        lg='auto'
      )
        span
          | Результатов на странице:
          v-menu(content-class='ug-table-remote__meta-limit')
            template(#activator='{on, attrs}')
              .ug-table-remote__meta-limit__chip(
                v-on='on',
                v-bind='attrs'
              )
                ug-base-chip.ml-2(
                  small,
                  color='#e0e0e0'
                )
                  span {{ resultsPerPage }}
                  v-icon(right) mdi-chevron-down
            v-list(dense)
              v-list-item-group(color='primary')
                v-list-item(
                  v-for='item in resultsPerPageMenu',
                  @click='handleResultsPerPageChange(item)'
                )
                  v-list-item-content
                    v-list-item-title(v-if='item !== "Максимум"') {{ item }}
                    v-list-item-title.red--text(v-else) {{ item }}

  .ug-table-remote__table-wrapper.elevation-1
    v-data-table(
      :server-items-length='itemsCount',
      :options.sync='options',
      :no-data-text='messageWhenNoData',
      :loading-text='messageWhenLoading',
      :loading='isLoading',
      :items='tableItems',
      :item-key='itemKeyField',
      :height='tableHeight',
      :headers='headersToShow',
      @update:sort-desc='debouncedUpdateTable',
      @update:sort-by='debouncedUpdateTable',
      @update:page='debouncedUpdateTable',
      @update:items-per-page='debouncedUpdateTable',
      multi-sort,
      hide-default-footer,
      fixed-header,
      dense
    )
      template(
        v-for='(_, slot) in $scopedSlots',
        #[slot]='scope'
      )
        slot(
          v-bind='scope',
          :name='slot'
        )
  v-slide-y-transition
    ug-table-remote-pagination(
      v-if='options',
      ref='pagination',
      v-model='options.page',
      :server-pages='serverPages',
      v-intersect.quiet='handlePaginationIntersect'
    )

  v-fab-transition
    v-btn(
      v-if='!isTopPanelVisible',
      :style='{ bottom: "64px" }',
      @click='moveToTopPanelVisible',
      small,
      left,
      fixed,
      fab,
      dark,
      color='primary',
      bottom
    )
      v-icon mdi-chevron-up
  v-fab-transition
    v-btn(
      v-if='!isPaginationVisible',
      @click='moveToPaginationVisible',
      small,
      left,
      fixed,
      fab,
      dark,
      color='primary',
      bottom
    )
      v-icon mdi-chevron-down
</template>

<script>
import { debounce } from 'lodash'
import UgBaseChip from '@/components/base/ui/base-chip/base-chip'
import UgTableRemotePagination from './table-remote-pagination/table-remote-pagination'
import TableRemoteHelpers from './table-remote.helpers'
import UgTabelRemotePanel from './table-remote-panel/table-remote-panel'
import Responsive from '@/mixins/responsive'

export default {
  name: 'ug-table-remote',

  components: {
    UgTabelRemotePanel,
    UgBaseChip,
    UgTableRemotePagination,
  },

  mixins: [TableRemoteHelpers, Responsive],

  props: {
    headersSchema: {
      required: true,
      type: Object,
    },

    headersSchemaId: {
      required: true,
      type: String,
    },

    fetchFunction: {
      required: true,
      type: Function,
    },

    includeSearchField: {
      required: false,
      type: Boolean,
    },

    includeOfficeField: {
      required: false,
      type: Boolean,
    },

    includeHeader: {
      required: false,
      type: Boolean,
    },

    includeMiddleToolbar: {
      required: false,
      type: Boolean,
    },

    socketEvent: {
      required: false,
      type: String,
      default: '',
    },

    itemKeyField: {
      required: false,
      type: String,
      default: 'id',
    },
  },

  data: function () {
    return {
      headers: null,
      search: '',
      resultsPerPageModel: 30,
      resultsPerPageMenu: [30, 50, 100, 200, 'Максимум'],

      isPaginationVisible: false,
      isTopPanelVisible: true,

      isLoading: false,
      itemsCount: Infinity,
      options: null,
      headersMenu: false,
      messageWhenNoData: 'Нет данных для отображения',
      messageWhenLoading: 'Данные загружаются...',
      items: null,
      debouncedUpdateTable: debounce(this.updateTable, 200),

      serverItems: 0,
      serverPages: 1,
    }
  },

  computed: {
    tableHeight() {
      if (this.isMobile) {
        return '100%'
      }

      return 'calc(100vh - 180px)'
    },

    tableItems() {
      if (this.items && this.items.docs) {
        return this.items.docs
      }

      return []
    },

    resultsPerPage() {
      if (this.resultsPerPageModel === 'Максимум' && this.serverItems > 0) {
        return this.serverItems
      }

      return this.resultsPerPageModel
    },

    headersToShow() {
      return this.excludeNotShownHeaders(this.headers)
    },
  },

  watch: {
    search: function () {
      this.debouncedUpdateTable()
    },
  },

  created: function () {
    this.init()
  },

  beforeDestroy: function () {
    this.$socket.client.off(this.socketEvent)
  },

  methods: {
    handlePaginationIntersect(_, __, isIntersection) {
      this.isPaginationVisible = isIntersection
    },

    handleTopPanelIntersect(_, __, isIntersection) {
      this.isTopPanelVisible = isIntersection
    },

    moveToPaginationVisible() {
      const { pagination } = this.$refs

      if (pagination && pagination.$el) {
        pagination.$el.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
      }
    },

    moveToTopPanelVisible() {
      const { topPanel } = this.$refs

      if (topPanel && topPanel.$el) {
        topPanel.$el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
      }
    },

    handleResultsPerPageChange(resultsPerPage) {
      this.resultsPerPageModel = resultsPerPage

      this.options = {
        ...this.options,
        page: 1,
        itemsPerPage: this.resultsPerPage,
      }
    },

    async updateTable() {
      this.isLoading = true
      if (this.options) {
        const response = await this.fetchFunction(this.processQuery(this.options))

        this.serverItems = response.totalDocs
        this.serverPages = response.totalPages

        this.items = response
      }

      this.isLoading = false
    },

    init() {
      this.options = this.generateOptions(1, this.resultsPerPage, this.itemKeyField)
      this.headers = this.generateHeaders(this.headersSchema, this.headersSchemaId)

      this.isLoading = true

      this.updateTable()

      this.$socket.client.on(this.socketEvent, () => {
        this.updateTable()
      })
    },
  },
}
</script>

<style lang="sass">
.ug-table-remote

  .ug-table-remote__meta
    display: flex
    color: var(--v-table_darkergrey-base)
    justify-content: space-between
    padding: 0 12px
    margin: 8px 0

    .ug-table-remote__meta-limit__chip
      cursor: pointer
      display: inline-block

  .ug-table-remote__table-wrapper
    margin: 0 12px

  thead tr th
    white-space: nowrap
</style>
