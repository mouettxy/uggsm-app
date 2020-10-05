<template lang="pug">
.orders-table
  v-toolbar.orders-table-toolbar(flat)
    v-btn(
      to='/orders/new',
      color='primary'
    )
      v-icon(left) mdi-plus
      span Новый заказ
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
              v-switch(v-model='header.hidden')
            v-list-item-title {{ header.text }}
  v-data-table(
    :server-items-length='totalItems',
    :options.sync='options',
    :loading='isLoading',
    :items='items',
    :headers='headers',
    :calculate-widths='true',
    @update:sort-desc='update',
    @update:sort-by='update',
    @update:page='update',
    @update:items-per-page='update',
    multi-sort,
    item-key='id'
  )
    template(#item.id='{value}')
      v-btn(
        :to='{ name: "orderModal", params: { id: value } }',
        :new-order='false',
        text
      )
        v-icon(left) mdi-pencil
        span {{ value }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ordersModule } from '@/store'

@Component
export default class OOrdersTable extends Vue {
  public columnsMenu = false
  public page = 1
  public options = {
    page: 1,
    itemsPerPage: 15,
    sortBy: ['id'],
    sortDesc: [true],
    mustSort: false,
    multiSort: true,
  }
  public headers: any = [
    {
      text: 'Заказ №',
      value: 'id',
      hidden: false,
    },
    {
      text: 'Срок заказа',
      value: 'estimatedClosedAt',
      hidden: false,
    },
    {
      text: 'Статус',
      value: 'status',
      hidden: false,
    },
    {
      text: 'Создан',
      value: 'created',
      hidden: false,
    },
    {
      text: 'Устройство',
      value: 'phoneModel',
      hidden: false,
    },
    {
      text: 'Бренд',
      value: 'phoneBrand',
      hidden: false,
    },
    {
      text: 'Неисправность',
      value: 'declaredDefect',
      hidden: false,
    },
    {
      text: 'Уведомления',
      value: 'notifications',
      hidden: false,
    },
    {
      text: 'Рекламная кампания',
      value: 'adversitement',
      hidden: false,
    },
    {
      text: 'Пароль',
      value: 'password',
      hidden: false,
    },
  ]
  public isLoading = false

  get items() {
    return ordersModule.ordersTable
  }

  get totalItems() {
    return ordersModule.countRows
  }

  update() {
    this.loadItems()
  }

  async loadItems() {
    await ordersModule.fetch(this.options)
  }

  created() {
    this.loadItems()
  }
}
</script>

<style lang="sass">
.orders-table
  .orders-table-toolbar
    .v-toolbar__content
      padding: 0 !important
      padding-right: 16px !important
</style>
