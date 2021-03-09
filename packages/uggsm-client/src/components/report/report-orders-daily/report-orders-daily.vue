<template lang="pug">
.ug-report-orders-daily
  v-card
    v-card-title Ежедневный отчёт
    v-card-text
      template(v-if='report && report.new.length && report.closed.length')
        v-card
          v-card-text.text-medium.text-center.dark--text
            v-row
              v-col(
                cols='12',
                md='3',
                lg='3'
              )
                span Итого новых: {{ sumOfReport.new }}
              v-col(
                cols='12',
                md='3',
                lg='3'
              )
                span Итого закрытых: {{ sumOfReport.closed }}
              v-col(
                cols='12',
                md='3',
                lg='3'
              )
                span Сумма работ: {{ sumOfReport.worksPrice }}
              v-col(
                cols='12',
                md='3',
                lg='3'
              )
                span Сумма в кассу: {{ sumOfReport.cashPrice }}
        .text-h6.my-4 Созданы сегодня
        v-expansion-panels
          v-expansion-panel(
            v-for='reportNewItem in report.new',
            :key='reportNewItem.office'
          )
            v-expansion-panel-header
              strong {{ reportNewItem.office }}
              template(#actions)
                v-chip.dark--text(
                  small,
                  label,
                  color='warning'
                ) {{ reportNewItem.ordersTotal }}
            v-expansion-panel-content
              v-data-table.elevation-1(
                :items-per-page='Infinity',
                :items='reportNewItem.orders',
                :headers='tableNewHeaders',
                light,
                hide-default-footer
              )
                template(#item.id='{item}')
                  template(v-if='item.id')
                    o-order-modal-regular(:orderid='item.id')
                      template(#activator='{on, attrs}')
                        v-btn(
                          v-on='on',
                          v-bind='attrs',
                          icon
                        )
                          v-icon mdi-eye
        .text-h6.my-4 Закрыты сегодня
        v-expansion-panels
          v-expansion-panel(
            v-for='reportClosedItem in report.closed',
            :key='reportClosedItem.office'
          )
            v-expansion-panel-header
              strong {{ reportClosedItem.office }}
              template(#actions)
                v-row.text-right(no-gutters)
                  v-col(
                    cols='12',
                    md='auto',
                    lg='auto'
                  )
                    v-tooltip(bottom)
                      template(#activator='{on, attrs}')
                        v-chip.dark--text(
                          v-on='on',
                          v-bind='attrs',
                          small,
                          label,
                          color='success'
                        ) {{ reportClosedItem.worksSum }} / {{ reportClosedItem.cashSum }}
                      span Работы / Касса
                  v-col.pl-0.pl-lg-1.pl-md-1(
                    cols='12',
                    md='auto',
                    lg='auto'
                  )
                    v-chip.dark--text(
                      small,
                      label,
                      color='warning'
                    ) {{ reportClosedItem.ordersTotal }}
            v-expansion-panel-content
              v-data-table.elevation-1(
                :items-per-page='Infinity',
                :items='reportClosedItem.orders',
                :headers='tableClosedHeaders',
                light,
                hide-default-footer
              )
                template(#item.id='{item}')
                  template(v-if='item.id')
                    o-order-modal-regular(:orderid='item.id')
                      template(#activator='{on, attrs}')
                        ug-base-btn(
                          v-on='on',
                          v-bind='attrs',
                          icon='mdi-eye',
                          color='dark'
                        )
      template(v-else)
        ug-base-alert(persistent) Сегодня ещё не было создано или закрыто заявок
</template>

<script>
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import UgBaseAlert from '@/components/base/ui/base-alert/base-alert'
import JsonExcel from 'vue-json-excel'

import OrderAPI from '@/api/order'
import moment from 'moment'

export default {
  name: 'ug-report-orders-daily',

  sockets: {
    ['update orders']() {
      this.getReport()
    },
  },

  components: {
    JsonExcel,
    UgBaseAlert,
    UgBaseBtn,
  },

  data: function () {
    return {
      report: null,
      panels: [0, 1],
      tableNewHeaders: [
        {
          text: '№',
          value: 'id',
        },
        {
          text: 'Клиент',
          value: 'client',
        },
        {
          text: 'Модель',
          value: 'phone',
        },
        {
          text: 'Поломка',
          value: 'defect',
        },
      ],

      tableClosedHeaders: [
        {
          text: '№',
          value: 'id',
        },
        {
          text: 'Клиент',
          value: 'client',
        },
        {
          text: 'Модель',
          value: 'phone',
        },
        {
          text: 'Поломка',
          value: 'defect',
        },
        {
          text: 'Работы (руб.)',
          value: 'worksPrice',
        },
        {
          text: 'Касса (руб.)',
          value: 'cashPrice',
        },
      ],
    }
  },

  computed: {
    sumOfReport() {
      if (!this.report) {
        return {
          new: 0,
          closed: 0,
          worksPrice: 0,
          cashPrice: 0,
        }
      }

      return {
        new: this.report.new.reduce((a, e) => {
          a += e.ordersTotal
          return a
        }, 0),

        closed: this.report.closed.reduce((a, e) => {
          a += e.ordersTotal
          return a
        }, 0),

        worksPrice: this.report.closed.reduce((a, e) => {
          a += e.cashSum
          return a
        }, 0),

        cashPrice: this.report.closed.reduce((a, e) => {
          a += e.worksSum
          return a
        }, 0),
      }
    },
  },

  mounted: function () {
    this.getReport()
  },

  methods: {
    async getReport() {
      const search = {
        date: [moment().startOf('day').toISOString(), moment().endOf('day').toISOString()],
      }

      const response = await OrderAPI.generateReport({ ...search, type: 'daily' })

      if (response.status !== 200) {
        this.$notification.warning('За сегодняшний день не найдены заявки')
        return
      }

      this.report = response.data
    },
  },
}
</script>
