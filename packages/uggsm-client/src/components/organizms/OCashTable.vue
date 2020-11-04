<template lang="pug">
.cash-table
  v-toolbar.orders-table-toolbar(flat)
    m-cash-modal-actions(type='income')
    m-cash-modal-actions(type='consumption')
    .text-h5.ml-4 Касса: {{ balance }}
    v-spacer
    v-menu(
      v-model='columnsMenu',
      :close-on-content-click='false',
      offset-x=''
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
  v-data-table(
    :server-items-length='totalItems',
    :options.sync='options',
    :loading='isLoading',
    :items='items',
    :headers='headersFormatted',
    :calculate-widths='true',
    @update:sort-desc='update',
    @update:sort-by='update',
    @update:page='update',
    @update:items-per-page='update',
    no-data-text='Не найдено заявок',
    multi-sort,
    loading-text='Загружаем кассу...',
    items-per-page-text='asd',
    item-key='id',
    hide-default-footer,
    height='calc(100vh - 230px)',
    dense
  )
    template(#item.createdBy='{value, item}')
      v-list-item
        v-list-item-content
          v-list-item-title {{ value }}
          v-list-item-subtitle {{ item.createdAt }}
    template(#item.income='{value}')
      span.success--text {{ value }}
    template(#item.consumption='{value}')
      span.error--text {{ value }}
    template(#item.balance='{value}')
      strong {{ value }}
    template(#item.actions='{item}')
      template(v-if='item.orderid')
        v-btn(
          :to='{ name: "orderModal", params: { id: item.orderid }, query: { from: "cash" } }',
          icon
        )
          v-icon mdi-eye
  v-pagination.mt-4(
    v-model='options.page',
    :length='Math.round(totalItems / options.itemsPerPage)',
    :current-page='options.page',
    total-visible='9'
  )
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { cashModule } from '@/store'
import { filter } from 'lodash'

@Component
export default class OCashTable extends Vue {
  public columnsMenu = false
  public headers: any = [
    {
      text: '№',
      value: 'id',
      show: true,
    },
    {
      text: 'Создал',
      value: 'createdBy',
      show: true,
    },
    {
      text: 'Комментарий',
      value: 'comment',
      show: true,
    },
    {
      text: 'Приход',
      value: 'income',
      show: true,
    },
    {
      text: 'Расход',
      value: 'consumption',
      show: true,
    },
    {
      text: 'Остаток',
      value: 'balance',
      show: true,
    },
    {
      text: 'Действия',
      value: 'actions',
      show: true,
    },
  ]

  get headersFormatted() {
    return filter(this.headers, (e) => {
      return e.show
    })
  }

  get balance() {
    return cashModule.balance
  }

  get isLoading() {
    return cashModule.isLoading
  }

  get items() {
    return cashModule.cashTable
  }

  get options() {
    return cashModule.options
  }

  set options(value) {
    cashModule.setOptions(value)
  }

  get totalItems() {
    return cashModule.countRows
  }

  update() {
    this.loadItems()
  }

  async loadItems() {
    await cashModule.fetch()
  }

  created() {
    this.loadItems()
  }
}
</script>

<style lang="sass">
.cash-table
  &-toolbar
    .v-toolbar__content
      padding: 0 !important
      padding-right: 16px !important
</style>
