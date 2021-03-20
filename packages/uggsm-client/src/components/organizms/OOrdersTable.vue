<template lang="pug">
.orders-table
  m-remote-table(:store='store')
    template(#top-toolbar='{store}')
      .success--text {{ store.tableRows }}
    template(#main-toolbar)
      template(v-if='selectedOffice')
        template(v-if='$can("createOrder", "Global")')
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
        template(v-if='$can("createGuarantyOrder", "Global")')
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
          v-menu(
            :close-on-content-click='false',
            eager
          )
            template(#activator='{on, attrs}')
              v-btn.ml-2(
                v-on='on',
                v-bind='attrs',
                color='secondary'
              )
                v-icon(left) mdi-filter-plus
                span фильтр
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
                    ug-select-many(
                      v-model='statusFilter',
                      :items='statuses',
                      @change='onStatusFilter',
                      label='Исключить статус(-ы)',
                      cache='orders-status-filter'
                    )
                v-row
                  template(v-if='isManager || isAdmin')
                    v-col(cols='12')
                      ug-select-many(
                        v-model='masterFilter',
                        :items='masters',
                        @change='onMastersFilter',
                        label='Мастер(-а)',
                        cache='orders-master-filter'
                      )
                    v-col(cols='12')
                      ug-select-many(
                        v-model='managerFilter',
                        :items='managers',
                        @change='onManagersFilter',
                        label='Менеджеры(-а)',
                        cache='orders-manager-filter'
                      )
                v-row
                  v-col(cols='10')
                    ug-datetime-picker(
                      v-model='dateFilter',
                      range
                    )
                  v-col(cols='2')
                    v-btn(
                      @click='removeDateFilter',
                      icon
                    )
                      v-icon mdi-close
        v-col(cols='auto')
          v-btn.ml-2(
            @click='onRemoveFilters',
            color='secondary'
          )
            v-icon(left) mdi-filter-remove
            span Сбросить фильтры
      template(v-else)
        v-col(cols='11')
          ug-base-alert(
            type='warning',
            persistent
          ) Не выбран офис, выберите свой офис в выпадающем списке сверху.
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
      ug-order-status(
        :status='value',
        :orderid='item.id',
        scope='table'
      )
    template(#item.estimatedCloseAt='{value, item}')
      ug-order-edit-time(
        :time='value',
        :orderid='item.id',
        :order-status='item.status',
        small,
        path='estimatedCloseAt'
      )
</template>

<script lang="ts">
import UgBaseAlert from '@/components/base/ui/base-alert/base-alert.vue'
import UgDatetimePicker from '@/components/base/ui/datetime-picker/datetime-picker.vue'
import UgSelectMany from '@/components/base/ui/select-many/select-many.vue'
import UgOrderEditTime from '@/components/order/order-edit-time/order-edit-time.vue'
import UgOrderStatus from '@/components/order/order-status/order-status.vue'

import { Component, Vue, Watch } from 'vue-property-decorator'
import { authModule, ordersModule, settingsModule } from '@/store'
import { cloneDeep, map, join } from 'lodash'
import { statuses } from '@/api/helpers/enums'
import { User } from '@/typings/api/auth'
import moment from 'moment'
import UserAPI from '@/api/user'

@Component({
  components: {
    UgBaseAlert,
    UgDatetimePicker,
    UgSelectMany,
    UgOrderEditTime,
    UgOrderStatus,
  },
})
export default class OOrdersTable extends Vue {
  public columnsMenu = false

  public displayExpired = false

  public displayManagerOrders = false

  public masterFilter = []

  public managerFilter = []

  public statusFilter = []

  public dateFilter = []

  public page = 1

  public statuses = statuses

  public users: Array<User> | null = null

  get selectedOffice() {
    return settingsModule.office
  }

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
      excludeStatus: this.statusFilter,
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

  rewindFilters() {
    this.columnsMenu = false
    this.displayExpired = false
    this.displayManagerOrders = false
    this.masterFilter = []
    this.managerFilter = []
    this.statusFilter = []
    this.dateFilter = []
    this.page = 1

    localStorage.removeItem('orders-manager-filter')
    localStorage.removeItem('orders-status-filter')
    localStorage.removeItem('orders-master-filter')
  }

  onRemoveFilters() {
    this.rewindFilters()
    this.store.setDefaultTableOptions()
    this.store.fetchTable()
  }

  async created() {
    this.users = (await UserAPI.get()).data
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
