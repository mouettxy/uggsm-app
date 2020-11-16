<template lang="pug">
.cash-table
  m-remote-table(:store='store')
    template(#main-toolbar)
      v-col(cols='auto')
        m-cash-modal-actions(type='income')
      v-col(cols='auto')
        m-cash-modal-actions(type='consumption')
      v-col(cols='auto')
        v-menu(:close-on-content-click='false')
          template(#activator='{on, attrs}')
            v-btn.ml-2(
              v-on='on',
              v-bind='attrs',
              icon
            )
              v-icon mdi-filter
          v-card
            v-card-text
              a-datetime-picker-2.mb-2(
                v-model='search.date',
                range
              )
              a-autocomplete.mb-2(
                v-model='search.cashier',
                label='Кассир',
                hide-details,
                endpoint='/master',
                disallow-free-type,
                dense
              )
            v-card-actions.d-flex.justify-center
              v-btn(
                @click='restoreFilter',
                color='error'
              ) Очистить
              v-btn(
                @click='applyFilter',
                color='primary'
              ) Применить

      v-col(cols='auto')
        .text-h5.ml-2 Касса: {{ balance }}
      v-slide-x-transition
        v-col(
          cols='auto',
          v-if='incomeByFilter || consumptionByFilter'
        )
          v-tooltip(top)
            template(#activator='{on, attrs}')
              .text-h5.ml-2.warning--text(
                v-on='on',
                v-bind='attrs'
              ) Всего: {{ incomeByFilter - consumptionByFilter }}
            span.success--text(:style='{ fontSize: "1.2rem" }') {{ incomeByFilter }}
            br
            span.error--text(:style='{ fontSize: "1.2rem" }') {{ consumptionByFilter }}
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
      o-order-modal-regular(:orderid='item.orderid')
        template(#activator='{on, attrs}')
          v-btn(
            v-on='on',
            v-bind='attrs',
            small,
            icon
          )
            v-icon mdi-eye
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { cashModule } from '@/store'
import { cloneDeep, filter } from 'lodash'
import moment from 'moment'

@Component
export default class OCashTable extends Vue {
  public search = {
    date: [moment().format('DD.MM.YYYY'), moment().format('DD.MM.YYYY')],
    cashier: '',
  }
  public incomeByFilter = 0
  public consumptionByFilter = 0

  get store() {
    return cashModule
  }

  get balance() {
    return this.store.balance
  }

  async applyFilter() {
    const copy = cloneDeep(this.search)

    copy.date[0] = moment(copy.date[0], 'DD.MM.YYYY').startOf('day').toISOString()
    copy.date[1] = moment(copy.date[1], 'DD.MM.YYYY').endOf('day').toISOString()

    this.store.setTableOptions({
      ...this.store.tableOptions,
      cashFilter: copy,
    })

    const total = await this.store.getTotalByFilter(copy)

    if (total) {
      this.incomeByFilter = total.income
      this.consumptionByFilter = total.consumption
    }

    this.reFetch()
  }

  restoreFilter() {
    const copy = cloneDeep(this.store.tableOptions)

    delete copy.cashFilter

    this.store.setTableOptions(copy)

    this.incomeByFilter = 0
    this.consumptionByFilter = 0

    this.reFetch()
  }

  reFetch() {
    this.store.fetchTable()
  }

  created() {
    this.store.getBalance()
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
