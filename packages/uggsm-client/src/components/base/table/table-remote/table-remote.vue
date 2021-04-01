<template lang="pug">
.ug-table-remote
  ug-table-remote-panel(
    ref='topPanel',
    :search.sync='search',
    :include-office-field='includeOfficeField',
    :headers.sync='headers',
    :headers-id='headersId',
    :filter-tokens='filterTokens',
    :filter-name='filterName',
    v-intersect.quiet='handleTopPanelIntersect'
  )
    template(#panel-top:inside)
      slot(name='panel-top:inside')
    template(#panel-top:outside)
      slot(name='panel-top:outside')
    template(#panel-top:inside:mobile)
      slot(name='panel-top:inside:mobile')
    template(#panel-top:outside:mobile)
      slot(name='panel-top:outside:mobile')
    template(#bottom-panel)
      slot(name='bottom-panel')

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
          ug-responsive-menu.d-inline-block(:menu-props='{ "content-class": "ug-table-remote__meta-limit" }')
            template(#activator='{on, attrs}')
              .ug-table-remote__meta-limit__chip(
                v-on='on',
                v-bind='attrs'
              )
                ug-base-chip.ml-2(
                  small,
                  color='table_darkergrey'
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
      mobile-breakpoint='0',
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
      template(#pagination-left)
        slot(
          name='pagination-left',
          :items='items'
        )

  template(v-if='isMobile')
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
import UgResponsiveMenu from '@/components/base/ui/responsive-menu/responsive-menu'
import UgTableRemotePagination from './table-remote-pagination/table-remote-pagination'
import TableRemoteHelpers from './table-remote.helpers'
import UgTableRemotePanel from './table-remote-panel/table-remote-panel'
import Responsive from '@/mixins/responsive'
import { mapState } from 'vuex'

export default {
  name: 'ug-table-remote',

  components: {
    UgTableRemotePanel,
    UgBaseChip,
    UgTableRemotePagination,
    UgResponsiveMenu,
  },

  mixins: [TableRemoteHelpers, Responsive],

  props: {
    headersSchema: {
      required: true,
      type: Object,
    },

    headersId: {
      required: true,
      type: String,
    },

    fetchFunction: {
      required: true,
      type: Function,
    },

    modifyItemsFunction: {
      required: false,
      type: Function,
      default: (items) => {
        return items
      },
    },

    filterName: {
      required: true,
      type: String,
    },

    filterTokens: {
      required: false,
      type: Array,
      default: () => [],
    },

    includeOfficeField: {
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

    initialSortField: {
      required: false,
      type: String,
      default: '',
    },

    initialSortDesc: {
      required: false,
      type: Boolean,
      default: true,
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

      serverItems: 0,
      serverPages: 1,

      debounce: 300,
    }
  },

  computed: {
    ...mapState({
      vuexCurrentFilter: (state) => state.filters.filterList,
    }),

    itemInitialSortField() {
      return this.initialSortField ? this.initialSortField : this.itemKeyField
    },

    currentFilter() {
      return this.vuexCurrentFilter[this.filterName].current
    },

    debouncedUpdateTable() {
      return debounce(this.updateTable, this.debounce)
    },

    tableHeight() {
      if (this.isMobile) {
        return '100%'
      }

      return 'calc(100vh - 180px)'
    },

    tableItems() {
      if (this.items && this.items.docs) {
        const items = this.items.docs

        return this.modifyItemsFunction(items)
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

    currentFilter: function () {
      this.options = {
        ...this.options,
        filter: this.currentFilter,
      }

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
        const processedQuery = this.processQuery(this.options)
        const response = await this.fetchFunction(processedQuery)

        this.serverItems = response.totalDocs
        this.serverPages = response.totalPages

        this.items = response
      }

      this.isLoading = false
    },

    init() {
      this.options = this.generateOptions(1, this.resultsPerPage, {
        by: this.itemInitialSortField,
        desc: this.initialSortDesc,
      })
      this.headers = this.generateHeaders(this.headersSchema, this.headersSchemaId)

      this.options = {
        ...this.options,
        filter: this.currentFilter,
      }

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

  tbody tr td
    white-space: nowrap
</style>
