<template lang="pug">
.orders-table
  m-remote-table(:store='store')
    template(#top-toolbar='{store}')
      .success--text {{ store.tableRows }}
    template(#main-toolbar)
      v-col(cols='auto')
        o-order-modal-new
          template(#activator='{on, attrs}')
            v-btn(
              v-on='on',
              v-bind='attrs',
              color='primary'
            )
              v-icon(left) mdi-plus
              span Новый
      v-col(cols='auto')
        o-order-modal-warranty
          template(#activator='{on, attrs}')
            v-btn.ml-2(
              v-on='on',
              v-bind='attrs',
              color='primary'
            )
              v-icon(left) mdi-eye-plus
              span гарантия
      v-col(cols='auto')
        v-btn.ml-2(
          @click='onClosedFilter',
          color='secondary'
        )
          v-icon(
            v-if='displayClosedOrders',
            left
          ) mdi-check
          v-icon(
            v-else,
            left
          ) mdi-close
          span Закрытые
      v-col(cols='auto')
        v-btn.ml-2(
          :color='displayExpired ? "success" : "secondary"',
          @click='onExpiredFilter'
        )
          span Просроченные
      template(v-if='isManager || isAdmin')
        v-btn.ml-2(
          :color='displayManagerOrders ? "success" : "secondary"',
          @click='onManagerFilter'
        ) Мои заказы
      v-col(cols='auto')
        a-select.mx-2(
          v-model='statusFilter',
          :items='statuses',
          @change='onStatusFilter',
          multiple,
          label='Статус',
          dense,
          cache='orders-status-filter'
        )
          template(#selection='{ item, index }')
            v-chip(
              v-if='index === 0',
              small
            )
              span {{ item }}
            v-chip(
              v-if='index === 1',
              small
            )
              | (+{{ statusFilter.length - 1 }})
    template(#item.id='{value, item}')
      o-order-modal-regular(
        :orderid='item.trueId',
        :new-order='false'
      )
        template(#activator='{on, attrs}')
          v-btn(
            v-on='on',
            v-bind='attrs',
            :style='{ background: item.quick ? "rgba(255, 82, 82, .4)" : "" }',
            text,
            small
          )
            v-icon(left) mdi-pencil
            span {{ value }}
    template(#item.status='{value, item}')
      m-order-status-switcher(
        :status='value',
        :orderid='item.id',
        scope='table'
      )
    template(#item.estimatedCloseAt='{value, item}')
      m-order-time-label(
        :time='value',
        :orderid='item.id',
        :order-status='item.status',
        small,
        path='estimatedCloseAt'
      )
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { authModule, ordersModule } from '@/store'
import { cloneDeep, filter, includes } from 'lodash'
import { statuses } from '@/api/helpers/enums'
import moment from 'moment'
import { Order } from '@/typings/api/order'
import { authEnpoints } from '@/api'

@Component
export default class OOrdersTable extends Vue {
  public columnsMenu = false
  public displayClosedOrders = false
  public displayExpired = false
  public displayManagerOrders = false
  public page = 1

  public statuses = statuses
  public statusFilter = []

  get store() {
    return ordersModule
  }

  get isManager() {
    return authModule.user?.role === 'manager'
  }

  get isAdmin() {
    return authModule.user?.role === 'administrator'
  }

  onManagerFilter() {
    this.displayManagerOrders = !this.displayManagerOrders

    if (this.displayManagerOrders) {
      this.store.setTableOptions({
        ...this.store.tableOptions,
        manager: authModule.user?._id,
      })
    } else {
      const copy = cloneDeep(this.store.tableOptions)

      delete copy.manager

      this.store.setTableOptions(copy)
    }

    this.store.fetchTable()
  }

  onStatusFilter() {
    this.store.setTableOptions({
      ...this.store.tableOptions,
      status: this.statusFilter,
    })

    this.store.fetchTable()
  }

  onExpiredFilter() {
    this.displayExpired = !this.displayExpired

    this.store.setTableOptions({
      ...this.store.tableOptions,
      orderDisplayOnlyExpired: this.displayExpired,
    })

    this.store.fetchTable()
  }

  onClosedFilter() {
    this.displayClosedOrders = !this.displayClosedOrders

    this.store.setTableOptions({
      ...this.store.tableOptions,
      excludeStatus: this.displayClosedOrders ? [] : ['Закрыт'],
    })

    this.store.fetchTable()
  }
}
</script>

<style lang="sass">
.orders-table
  .orders-table-toolbar
    .v-toolbar__content
      padding: 0 !important
      padding-right: 16px !important
  .v-data-table__wrapper
    table
      thead, tbody
        tr
          th, td
            white-space: nowrap
</style>
