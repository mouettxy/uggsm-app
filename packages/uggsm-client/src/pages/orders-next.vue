<route>
{
  "name": "ordersNext",
  "meta": {
    "header": "[Beta] Заказы"
  }
}
</route>

<template lang="pug">
.page-orders
  ug-table-remote(
    ref='table',
    :modify-items-function='modifyItems',
    :headers-schema='headersSchema',
    :filter-tokens='filterTokens',
    :fetch-function='fetchFunction',
    socket-event='orders updated',
    item-key-field='trueId',
    initial-sort-field='createdAt',
    include-office-field,
    headers-id='orders-headers-id',
    filter-name='orders'
  )
    template(#bottom-panel)
      v-row.mr-2.mr-lg-0.mr-md-0(
        no-gutters,
        align-items='center'
      )
        v-col(
          cols='6',
          v-if='$can("addCashIncome", "Global")',
          md='auto',
          lg='auto'
        ) 
          o-order-modal-new
            template(#activator='{on, attrs}')
              ug-table-remote-btn(
                v-on='on',
                v-bind='attrs',
                label='Новый',
                icon='mdi-plus',
                block
              )
        v-col(
          cols='6',
          v-if='$can("addCashConsumption", "Global")',
          md='auto',
          lg='auto'
        ) 
          o-order-modal-warranty
            template(#activator='{on, attrs}')
              ug-table-remote-btn.ml-2(
                v-on='on',
                v-bind='attrs',
                label='Гарантия',
                icon='mdi-eye-plus',
                block
              )
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
    template(#item.customer='{value}')
      span {{ value }}
    template(#item.master='{value}')
      span {{ value }}
</template>

<script>
import UgTableRemote from '@/components/base/table/table-remote/table-remote'
import UgOrderEditTime from '@/components/order/order-edit-time/order-edit-time'
import UgOrderStatus from '@/components/order/order-status/order-status'

import OrderAPI from '@/api/order'
import { mapState } from 'vuex'
import { Filters } from '@/helpers/filterHelper'
import { map, reduce } from 'lodash'
import moment from 'moment'

export default {
  name: 'ug-page-orders',

  components: {
    UgTableRemote,
    UgOrderEditTime,
    UgOrderStatus,
  },

  data: function () {
    return {
      headersSchema: {
        id: '№',
        estimatedCloseAt: 'Срок заказа',
        status: 'Статус',
        customer: 'Клиент',
        master: 'Мастер',
        createdAt: 'Создан',
        phoneBrand: 'Бренд',
        phoneModel: 'Устройство',
        declaredDefect: 'Неисправность',
        totalWorks: 'Сумма работ',
        password: 'Пароль',
      },

      filterTokens: Filters.orders,
    }
  },

  computed: {
    ...mapState({
      office: (state) => state.settings.office,
    }),
  },

  watch: {
    office: function () {
      const { table } = this.$refs

      table.updateTable()
    },
  },

  methods: {
    getTime(date) {
      const m = moment(date)
      return `${m.format('DD.MM.YYYY')} ${m.format('HH:mm')}`
    },

    modifyItems(items) {
      return map(items, (e) => {
        const createTime = this.getTime(e.createdAt)
        const totalWorks = reduce(
          e.statusWork,
          (a, el) => {
            a += el.price
            return a
          },
          0
        )
        let id = String(e.id)
        if (e.warrantyOrderId) {
          id = `${e.warrantyOrderId}/${e.warrantyCounter}`
        }

        return {
          id,
          trueId: e.id,
          estimatedCloseAt: e.estimatedCloseAt,
          status: e.status,
          createdAt: createTime,
          master: e.master?.credentials || '',
          phoneModel: e.phoneModel,
          phoneBrand: e.phoneBrand,
          password: e.password,
          declaredDefect: e.declaredDefect,
          quick: e.quick,
          customer: e.customerName,
          clientId: e.customer ? e.customer.id : false,
          totalWorks,
        }
      })
    },

    async fetchFunction(data) {
      const response = await OrderAPI.getPaginatedNew({
        ...data,
        office: this.office._id,
      })

      if (response.status !== 200) {
        this.$notification.error('Не удалось получить данные')
        return []
      }

      return response.data
    },
  },
}
</script>
