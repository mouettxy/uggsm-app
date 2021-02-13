<template lang="pug">
.orders-table
  m-remote-table(:store='store')
    template(#top-toolbar='{store}')
      .success--text {{ store.tableRows }}
    template(#main-toolbar)
      can(
        I='create',
        a='Order'
      )
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
      can(
        I='create',
        a='createGuaranty'
      )
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
        v-menu(:close-on-content-click='false')
          template(#activator='{on, attrs}')
            v-btn.ml-2(
              v-on='on',
              v-bind='attrs',
              icon,
              color='black'
            )
              v-icon mdi-filter
          v-card(dark)
            v-card-text
              v-row
                v-col(cols='auto')
                  v-btn.ml-2(
                    :color='displayExpired ? "success" : "secondary"',
                    @click='onExpiredFilter'
                  )
                    span Просроченные
                template(v-if='isManager || isAdmin')
                  v-col(cols='auto')
                    v-btn.ml-2(
                      :color='displayManagerOrders ? "success" : "secondary"',
                      @click='onManagerFilter'
                    ) Мои заказы
              v-row
                v-col(cols='12')
                  a-select(
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
                      v-menu(open-on-hover)
                        template(#activator='{on, attrs}')
                          v-chip(
                            v-if='index === 1',
                            v-on='on',
                            v-bind='attrs',
                            small
                          )
                            | (+{{ statusFilter.length - 1 }})
                        v-card(dark)
                          v-card-text
                            span.white--text {{ joinArray(statusFilter.slice(1)) }}
              v-row
                template(v-if='isManager || isAdmin')
                  v-col(cols='12')
                    a-select-many(
                      v-model='masterFilter',
                      :items='masters',
                      @change='onMastersFilter',
                      label='Мастер(-а)',
                      cache='orders-master-filter'
                    )
                  v-col(cols='12')
                    a-select-many(
                      v-model='managerFilter',
                      :items='managers',
                      @change='onManagersFilter',
                      label='Менеджеры(-а)',
                      cache='orders-manager-filter'
                    )
              v-row
                v-col(cols='10')
                  a-datetime-picker-2(
                    v-model='dateFilter',
                    range
                  )
                v-col(cols='2')
                  v-btn(
                    @click='removeDateFilter',
                    icon
                  )
                    v-icon mdi-close
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
import { authModule, ordersModule, usersModule } from '@/store'
import { cloneDeep, map, join } from 'lodash'
import { statuses } from '@/api/helpers/enums'
import { User } from '@/typings/api/auth'
import moment from 'moment'

@Component
export default class OOrdersTable extends Vue {
  public columnsMenu = false

  public displayClosedOrders = false
  public displayExpired = false
  public displayManagerOrders = false

  public masterFilter = []
  public managerFilter = []
  public statusFilter = []

  public dateFilter = []

  public page = 1

  public statuses = statuses
  public users: Array<User> | null = null

  @Watch('dateFilter')
  onDateFilter(date: Array<string>) {
    if (date[0] && date[1]) {
      const copyDate = cloneDeep(date)
      copyDate[0] = moment(copyDate[0], 'DD.MM.YYYY').startOf('day').toISOString()
      copyDate[1] = moment(copyDate[1], 'DD.MM.YYYY').endOf('day').toISOString()

      this.store.setTableOptions({
        ...this.store.tableOptions,
        date: copyDate,
      })
      this.store.fetchTable()
    }
  }

  removeDateFilter() {
    const copyOptions = cloneDeep(this.store.tableOptions)

    delete copyOptions.date

    this.store.setTableOptions(copyOptions)

    this.store.fetchTable()

    this.dateFilter = []
  }

  get store() {
    return ordersModule
  }

  get isManager() {
    return authModule.user?.role === 'manager'
  }

  get isAdmin() {
    return authModule.user?.role === 'administrator'
  }

  get masters() {
    if (this.users?.length) {
      return map(this.users, (e) => ({
        text: e.credentials,
        value: e._id,
      }))
    }

    return []
  }

  get managers() {
    if (this.users?.length) {
      return map(this.users, (e) => ({
        text: e.credentials,
        value: e._id,
      }))
    }

    return []
  }

  joinArray(arr: string[]) {
    return join(arr, ', ')
  }

  onMastersFilter() {
    this.store.setTableOptions({
      ...this.store.tableOptions,
      masters: this.masterFilter,
    })
    this.store.fetchTable()
  }

  onManagersFilter() {
    this.store.setTableOptions({
      ...this.store.tableOptions,
      managers: this.managerFilter,
    })
    this.store.fetchTable()
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

  async created() {
    this.users = await usersModule.getAll()
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
