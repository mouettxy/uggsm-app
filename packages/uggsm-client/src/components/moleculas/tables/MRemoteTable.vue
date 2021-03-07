<template lang="pug">
.remote-table
  v-row.top-toolbar.elevation-1(no-gutters)
    v-col(cols='auto')
      template(v-if='displayOfficeSwitcher')
        ug-office-switcher(@office-select="handleOfficeSelect")
      template(v-else)
        .text-h5 {{ $route.meta.header }}
    template(
      name='top-toolbar',
      :store='store'
    )
    v-col.top-toolbar__search(
      cols='auto',
      v-if='displaySearchField'
    )
      m-search-field(:type='$route.name')
  v-row.main-toolbar(no-gutters)
    slot(
      name='main-toolbar',
      :store='store'
    )
    v-spacer
    v-col(cols='auto')
      v-menu(
        v-model='headersMenu',
        :close-on-content-click='false',
        max-height='400'
      )
        template(#activator='{ on, attrs }')
          v-btn(
            v-on='on',
            v-bind='attrs',
            icon
          )
            v-icon mdi-table-large
        v-card
          v-list
            v-list-item(
              v-for='header in tableHeadersRaw',
              :key='header.value'
            )
              v-list-item-action
                v-switch(v-model='header.show')
              v-list-item-title {{ header.text }}
  .table-wrapper.elevation-1
    v-data-table(
      :server-items-length='tableTotalItems',
      :options.sync='tableOptions',
      :no-data-text='noDataText',
      :loading-text='loadingText',
      :loading='isTableLoading',
      :items='tableItems',
      :item-key='itemsKey',
      :height='height',
      :headers='tableHeaders',
      @update:sort-desc='tableUpdate',
      @update:sort-by='tableUpdate',
      @update:page='tableUpdate',
      @update:items-per-page='tableUpdate',
      multi-sort,
      dense,
      hide-default-footer,
      fixed-header
    )
      template(v-for='(_, slot) of $scopedSlots' #[slot]='scope')
        slot(:name='slot' v-bind='scope')
  .table-pagination
    .table-pagination__total
      .table-pagination__total-content.success--text Всего: {{ tableTotalItems }}
    v-pagination.mt-4(
      v-if="Math.ceil(tableTotalItems / tableOptions.itemsPerPage)"
      v-model='tableOptions.page',
      :length='Math.ceil(tableTotalItems / tableOptions.itemsPerPage)',
      :current-page='tableOptions.page',
      total-visible='9'
    )
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import UgOfficeSwitcher from '@/components/office/office-switcher/office-switcher.vue'

@Component({
  components: {
    UgOfficeSwitcher,
  },
})
export default class MRemoteTable extends Vue {
  @Prop({ default: true }) displayOfficeSwitcher!: boolean
  @Prop({ default: true }) displaySearchField!: boolean

  @Prop({ default: 'Не найдено элементов' }) noDataText!: string
  @Prop({ default: 'Загружаем элементы' }) loadingText!: string

  @Prop({ default: 'calc(100vh - 160px)' }) height!: string
  @Prop({ default: 'id' }) itemsKey!: string

  @Prop({ required: true }) store!: any

  public headersMenu = false

  @Watch('tableHeadersRaw', { deep: true })
  onTableHeadersChange(value: any) {
    this.store.setTableHeaders(value)
  }

  get tableHeaders() {
    return this.store.tableHeadersFormatted
  }

  get tableHeadersRaw() {
    return this.store.tableHeaders
  }

  get tableTotalItems() {
    return this.store.tableRows
  }

  get tableOptions() {
    return this.store.tableOptions
  }

  set tableOptions(value) {
    this.store.setTableOptions(value)
  }

  get isTableLoading() {
    return this.store.isLoading
  }

  get tableItems() {
    return this.store.tableItems
  }

  handleOfficeSelect() {
    this.loadTable()
  }

  async tableUpdate() {
    this.loadTable()
  }

  async loadTable() {
    this.store.fetchTable()
  }

  mounted() {
    this.loadTable()
  }
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
