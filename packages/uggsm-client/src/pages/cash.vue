<route>
{
  "name": "cash",
  "meta": {
    "header": "Касса"
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
    socket-event='update cashes',
    item-key-field='id',
    initial-sort-field='createdAt',
    include-office-field,
    headers-id='cash-headers-id',
    filter-name='cashes'
  )
    template(#pagination-left='{ items }')
      v-row(v-if='items')
        v-col.py-0(
          cols='12',
          md='auto',
          lg='auto'
        )
          span.text-no-wrap Всего: {{ items.total }}
        v-col.py-0(
          cols='12',
          md='auto',
          lg='auto'
        )
          span.text-no-wrap Приход: {{ items.income }}
        v-col.py-0(
          cols='12',
          md='auto',
          lg='auto'
        )
          span.text-no-wrap Расход: {{ items.consumption }}
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
          ug-modal-cash-income
            template(#activator='{on, attrs}')
              ug-table-remote-btn(
                v-on='on',
                v-bind='attrs',
                label='Приход',
                icon='mdi-plus',
                block
              )
        v-col(
          cols='6',
          v-if='$can("addCashConsumption", "Global")',
          md='auto',
          lg='auto'
        ) 
          ug-modal-cash-consumption
            template(#activator='{on, attrs}')
              ug-table-remote-btn.ml-2(
                v-on='on',
                v-bind='attrs',
                label='Расход',
                icon='mdi-minus',
                block
              )
    template(#item.income='{value}')
      span.success--text {{ value }}
    template(#item.consumption='{value}')
      span.error--text {{ value }}
    template(#item.balance='{value}')
      strong {{ value }}
    template(#item.actions='{item}')
      ug-modal-order(
        v-if='item.orderid',
        :order-id='item.orderid'
      )
        template(#activator='{on, attrs}')
          v-btn(
            v-on='on',
            v-bind='attrs',
            small,
            icon
          )
            v-icon mdi-eye
</template>

<script>
import UgTableRemote from '@/components/base/table/table-remote/table-remote'
import UgModalCashConsumption from '@/components/cash/modal-cash-consumption/modal-cash-consumption'
import UgModalCashIncome from '@/components/cash/modal-cash-income/modal-cash-income'
import UgModalOrder from '@/components/order/modal-order/modal-order'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import UgTableRemoteBtn from '@/components/base/table/table-remote/table-remote-btn/table-remote-btn'

import { mapState } from 'vuex'
import { Filters } from '@/helpers/filterHelper'
import { map } from 'lodash'
import moment from 'moment'
import { getAnonymousAnimal } from '@/api/helpers'
import CashAPI from '@/api/cash'

export default {
  name: 'ug-page-cash',

  components: {
    UgTableRemote,
    UgModalCashConsumption,
    UgModalCashIncome,
    UgModalOrder,
    UgBaseBtn,
    UgTableRemoteBtn,
  },

  data: function () {
    return {
      headersSchema: {
        id: '№',
        createdBy: 'Создал',
        createdAt: 'Дата создания',
        comment: 'Комментарий',
        income: 'Приход',
        consumption: 'Расход',
        balance: 'Остаток',
        actions: 'Действия',
      },

      filterTokens: Filters.cashes || [],
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
    modifyItems(items) {
      return map(items, (e) => {
        const cashier = e.cashier ? e.cashier.credentials : getAnonymousAnimal()

        return {
          id: e.id,
          createdBy: cashier,
          createdAt: moment(e.createdAt).format('DD MMMM YYYY'),
          comment: e.comment,
          income: e.income,
          consumption: e.consumption,
          balance: e.balance,
          orderid: e.orderid,
        }
      })
    },

    async fetchFunction(data) {
      const response = await CashAPI.getPaginated({
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
