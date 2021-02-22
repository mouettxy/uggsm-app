<template lang="pug">
.ug-table-remote
  v-toolbar.ug-table-remote__top-toolbar.mb-2(
    :height='isMobile ? 96 : 64',
    elevation='2'
  )
    slot(name='top-toolbar')
      template(v-if='isMobile')
        v-row(
          no-gutters,
          align='center'
        )
          v-col(
            cols='12',
            v-if='includeSearchField'
          )
            ug-base-input(
              v-model='search',
              label='Поиск...',
              icon='mdi-magnify'
            )

          v-col(
            cols='2',
            v-if='serverItems'
          )
            v-chip(
              title='Всего элементов',
              label
            )
              span {{ serverItems }}
          v-col.text-center(
            cols='8',
            v-if='includeHeader'
          )
            .text-h6 {{ $route.meta.header }}
          v-col.text-right(cols='2')
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
                    v-for='header in headers',
                    :key='header.value'
                  )
                    v-list-item-action
                      v-switch(v-model='header.show')
                    v-list-item-title {{ header.text }}
      template(v-else)
        v-row(align='center')
          v-col(
            cols='auto',
            v-if='includeHeader'
          )
            .text-h5 {{ $route.meta.header }}
          v-col(
            cols='auto',
            v-if='includeSearchField'
          )
            ug-base-input(
              v-model='search',
              label='Поиск...',
              icon='mdi-magnify'
            )
          v-col(
            cols='auto',
            v-if='includeOfficeField'
          )
            span //! TODO: Office field
          v-col.ml-auto(
            cols='auto',
            v-if='serverItems'
          )
            v-chip(
              title='Всего элементов',
              label
            )
              span {{ serverItems }}
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
                    v-for='header in headers',
                    :key='header.value'
                  )
                    v-list-item-action
                      v-switch(v-model='header.show')
                    v-list-item-title {{ header.text }}
  v-toolbar.ug-table-remote__middle-toolbar.mb-2(
    v-if='includeMiddleToolbar',
    flat,
    dense
  )
    slot(name='middle-toolbar')
      span Middle toolbar
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
      template(#body.append)
        template(v-if="serverItems > 0")
          tr
            td.px-0(:colspan="headers.length")
              v-card.d-flex.justify-center.align-center(v-intersect.quiet='infiniteScroll' height="64" tile)
      template(v-for='(_, slot) of $scopedSlots' #[slot]='scope')
        slot(:name='slot' v-bind='scope')
</template>

<script lang="ts">
import { debounce, each } from 'lodash'
import { Component, Prop, Watch, Mixins, Vue } from 'vue-property-decorator'
import TableRemoteHelpers from './table-remote.helpers'
import Responsive from '@/mixins/responive'
import { Socket } from 'vue-socket.io-extended'

@Component
export default class UgTableRemote extends Mixins(TableRemoteHelpers, Responsive) {
  @Prop({ required: true }) headersSchema!: Record<string, string>
  @Prop({ required: true }) headersSchemaId!: string
  @Prop({ required: true }) fetchFunction!: (options: any) => any

  @Prop({ required: false }) includeSearchField!: boolean
  @Prop({ required: false }) includeOfficeField!: boolean
  @Prop({ required: false, default: true }) includeHeader!: boolean
  @Prop({ required: false, default: true }) includeMiddleToolbar!: boolean
  @Prop({ required: false, default: '' }) socketEvent!: string
  @Prop({ required: false, default: 'id' }) itemKeyField!: string

  public isLoading = false

  public itemsCount = Infinity

  public options: any = null
  public headers: any = null
  public headersMenu = false

  public messageWhenNoData = 'Нет данных для отображения'
  public messageWhenLoading = 'Данные загружаются...'

  public items: any = null

  public debouncedUpdateTable: any = debounce(this.updateTable, 700)

  public serverItems = 0
  public serverPages = 0
  public finalPageReached = false

  @Watch('search')
  onSearchChange() {
    this.debouncedUpdateTable()
  }

  get tableHeight() {
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
  }

  get tableItems() {
    if (this.items && this.items.docs) {
      return this.items.docs
    }

    return []
  }

  get headersToShow() {
    return this.excludeNotShownHeaders(this.headers)
  }

  async updateTable(isInfiniteScroll?: boolean) {
    this.isLoading = true
    if (this.options) {
      const response = await this.fetchFunction(this.processQuery(this.options))

      this.serverItems = response.totalDocs
      this.serverPages = response.totalPages

      if (isInfiniteScroll) {
        if (this.items && this.items.docs && response.docs) {
          each(response.docs, (e) => {
            this.items.docs.push(e)
          })
          this.isLoading = false
          return
        }
      }

      this.items = response
    }

    this.isLoading = false
  }

  infiniteScroll(_: any, __: any, isIntersecting: boolean) {
    console.log('intersect')
    if (isIntersecting && !this.search) {
      if (!(this.options.page + 1 > this.serverPages)) {
        this.options.page++
        this.debouncedUpdateTable(true)
      } else {
        this.finalPageReached = true
      }
    }
  }

  init() {
    this.options = this.generateOptions(1, 20, this.itemKeyField)
    this.headers = this.generateHeaders(this.headersSchema, this.headersSchemaId)

    this.isLoading = true

    this.$socket.client.on(this.socketEvent, () => {
      this.updateTable()
    })
  }

  mounted() {
    this.init()
  }

  beforeDestroy() {
    this.$socket.client.off(this.socketEvent)
  }
}
</script>
