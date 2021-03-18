<template>
  <div class="remote-table">
    <v-row class="top-toolbar elevation-1" no-gutters>
      <v-col cols="auto">
        <template v-if="displayOfficeSwitcher">
          <ug-office-switcher @office-select="handleOfficeSelect"></ug-office-switcher>
        </template>
        <template v-else>
          <div class="text-h5">{{ $route.meta.header }}</div>
        </template>
      </v-col>
      <slot name="top-toolbar" :store="store"></slot>
      <v-col v-if="displaySearchField" class="top-toolbar__search" cols="auto">
        <m-search-field :type="$route.name"></m-search-field>
      </v-col>
    </v-row>
    <v-row class="main-toolbar" no-gutters>
      <slot name="main-toolbar" :store="store"></slot>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-menu v-model="headersMenu" :close-on-content-click="false" max-height="400">
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" icon v-on="on">
              <v-icon>mdi-table-large</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-list>
              <v-list-item v-for="header in tableHeadersRaw" :key="header.value">
                <v-list-item-action>
                  <v-switch v-model="header.show"></v-switch>
                </v-list-item-action>
                <v-list-item-title>{{ header.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
    <div class="table-wrapper elevation-1">
      <v-data-table
        dense
        fixed-header
        :headers="tableHeaders"
        :height="height"
        hide-default-footer
        :item-key="itemsKey"
        :items="tableItems"
        :loading="isTableLoading"
        :loading-text="loadingText"
        multi-sort
        :no-data-text="noDataText"
        :options.sync="tableOptions"
        :server-items-length="tableTotalItems"
        @update:items-per-page="tableUpdate"
        @update:page="tableUpdate"
        @update:sort-by="tableUpdate"
        @update:sort-desc="tableUpdate"
      >
        <template v-for="(_, slot) of $scopedSlots" #[slot]="scope">
          <slot :name="slot" v-bind="scope"></slot>
        </template>
      </v-data-table>
    </div>
    <div class="table-pagination">
      <div class="table-pagination__total">
        <div class="table-pagination__total-content success--text">Всего: {{ tableTotalItems }}</div>
      </div>
      <v-pagination
        v-if="Math.ceil(tableTotalItems / tableOptions.itemsPerPage)"
        v-model="tableOptions.page"
        class="mt-4"
        :current-page="tableOptions.page"
        :length="Math.ceil(tableTotalItems / tableOptions.itemsPerPage)"
        total-visible="9"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import UgOfficeSwitcher from '@/components/office/office-switcher/office-switcher'
import MSearchField from '../MSearchField'

export default {
  name: 'm-remote-table',

  components: {
    MSearchField,
    UgOfficeSwitcher,
  },

  props: {
    displayOfficeSwitcher: {
      required: false,
      type: Boolean,
      default: true,
    },

    displaySearchField: {
      required: false,
      type: Boolean,
      default: true,
    },

    noDataText: {
      required: false,
      type: String,
      default: 'Не найдено элементов',
    },

    loadingText: {
      required: false,
      type: String,
      default: 'Загружаем элементы',
    },

    height: {
      required: false,
      type: String,
      default: 'calc(100vh - 160px)',
    },

    itemsKey: {
      required: false,
      type: String,
      default: 'id',
    },

    store: {
      required: true,
      type: [Object, Array],
    },
  },

  data: () => ({
    headersMenu: false,
  }),

  computed: {
    tableOptions: {
      get: function () {
        return this.store.tableOptions
      },

      set: function (value) {
        this.store.setTableOptions(value)
      },
    },

    tableHeaders() {
      return this.store.tableHeadersFormatted
    },

    tableHeadersRaw() {
      return this.store.tableHeaders
    },

    tableTotalItems() {
      return this.store.tableRows
    },

    isTableLoading() {
      return this.store.isLoading
    },

    tableItems() {
      return this.store.tableItems
    },
  },

  watch: {
    tableHeadersRaw: {
      deep: true,
      handler: function (value) {
        this.store.setTableHeaders(value)
      },
    },
  },

  mounted: function () {
    this.loadTable()
  },

  methods: {
    handleOfficeSelect() {
      this.loadTable()
    },

    async tableUpdate() {
      this.loadTable()
    },

    async loadTable() {
      this.store.fetchTable()
    },
  },
}
</script>

<style lang="sass">
.remote-table
  .top-toolbar
    padding: 8px
    align-items: center
    &__search
      padding-left: 16px
  .main-toolbar
    align-items: center
    justify-content: space-between
    padding: 8px
    margin-left: 4px
    margin-right: 4px
  .table-wrapper
    margin-left: 4px
    margin-right: 4px
  .table-pagination
    margin-top: 4px
    display: flex
    justify-content: center
    align-items: center
    font-size: 1.2rem
    nav
      margin-top: 0 !important
</style>
