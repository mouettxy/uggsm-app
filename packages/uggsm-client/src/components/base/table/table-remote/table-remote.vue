<template lang="pug">
.ug-table-remote
  ug-table-remote-panel(
    :search.sync='search',
    :include-office-field='includeOfficeField',
    :headers.sync='headers'
  )

  .ug-table-remote__table-wrapper.mx-2.elevation-1
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
</template>

<script>
import { debounce } from 'lodash'
import TableRemoteHelpers from './table-remote.helpers'
import UgTabelRemotePanel from './table-remote-panel/table-remote-panel'
import Responsive from '@/mixins/responive'

export default {
  name: 'ug-table-remote',

  components: {
    UgTabelRemotePanel,
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

      isLoading: false,
      itemsCount: Infinity,
      options: null,
      headersMenu: false,
      messageWhenNoData: 'Нет данных для отображения',
      messageWhenLoading: 'Данные загружаются...',
      items: null,
      debouncedUpdateTable: debounce(this.updateTable, 700),
      serverItems: 0,
    }
  },

  computed: {
    tableHeight() {
      if (this.isMobile) {
        if (!this.includeMiddleToolbar) {
          return 'calc(100vh - 115px)'
        }

        return 'calc(100vh - 170px)'
      }

      if (!this.includeMiddleToolbar) {
        return 'calc(100vh - 80px)'
      }

      return 'calc(100vh - 135px)'
    },

    tableItems() {
      if (this.items && this.items.docs) {
        return this.items.docs
      }

      return []
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

  mounted: function () {
    this.init()
  },

  beforeDestroy: function () {
    this.$socket.client.off(this.socketEvent)
  },

  methods: {
    async updateTable() {
      this.isLoading = true
      if (this.options) {
        const response = await this.fetchFunction(this.processQuery(this.options))

        this.serverItems = response.totalDocs

        this.items = response
      }

      this.isLoading = false
    },

    init() {
      this.options = this.generateOptions(1, 20, this.itemKeyField)
      this.headers = this.generateHeaders(this.headersSchema, this.headersSchemaId)

      this.isLoading = true

      this.$socket.client.on(this.socketEvent, () => {
        this.updateTable()
      })
    },
  },
}
</script>

<style lang="sass">
.ug-table-remote
  thead
    tr
      th
        white-space: nowrap
</style>
