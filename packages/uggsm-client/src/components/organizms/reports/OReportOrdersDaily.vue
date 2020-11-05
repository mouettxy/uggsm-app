<template lang="pug">
.report-orders-daily
  v-card
    v-row.fill-height.report-orders-daily__toolbar
      v-col(cols='2')
        v-card-title Ежедневный отчёт
      v-col.text-right(cols='10')
        v-btn.mx-1(
          @click='getReport',
          color='primary'
        ) Обновить
    template(v-if='reports && reports.new.length && reports.closed.length')
      v-container(fluid)
        v-expansion-panels(
          v-model='panels',
          multiple
        )
          v-expansion-panel
            v-expansion-panel-header
              strong Созданы сегодня
            v-expansion-panel-content
              v-expansion-panels(dark)
                v-expansion-panel.secondary(
                  v-for='report in reports.new',
                  :key='report.office'
                )
                  v-expansion-panel-header
                    strong {{ report.office }}
                    template(#actions)
                      strong.warning--text {{ report.ordersTotal }}
                  v-expansion-panel-content
                    v-data-table.elevation-2.softgrey(
                      :items-per-page='99999',
                      :items='report.orders',
                      :headers='tableNewHeaders',
                      light,
                      hide-default-footer
                    )
                      template(#item.id='{item}')
                        template(v-if='item.id')
                          o-order-modal(
                            :orderid='item.id',
                            :new-order='false'
                          )
                            template(#activator='{on, attrs}')
                              v-btn(
                                v-on='on',
                                v-bind='attrs',
                                icon
                              )
                                v-icon mdi-eye
          v-expansion-panel
            v-expansion-panel-header
              strong Закрыты сегодня
            v-expansion-panel-content
              v-expansion-panels(dark)
                v-expansion-panel.secondary(
                  v-for='report in reports.closed',
                  :key='report.office'
                )
                  v-expansion-panel-header
                    strong {{ report.office }}
                    template(#actions)
                      strong.success--text Работы: {{ report.worksSum }}
                      strong.success--text.ml-4 Касса: {{ report.cashSum }}
                      strong.warning--text.ml-4 {{ report.ordersTotal }}
                  v-expansion-panel-content
                    v-data-table.elevation-2.softgrey(
                      :items-per-page='99999',
                      :items='report.orders',
                      :headers='tableClosedHeaders',
                      light,
                      hide-default-footer
                    )
                      template(#item.id='{item}')
                        template(v-if='item.id')
                          o-order-modal(
                            :orderid='item.id',
                            :new-order='false'
                          )
                            template(#activator='{on, attrs}')
                              v-btn(
                                v-on='on',
                                v-bind='attrs',
                                icon
                              )
                                v-icon mdi-eye
          v-card.mt-4
          .text-center
            v-row
              v-col
                span Итого новых: {{ sum.new }}
              v-col
                span Итого закрытых: {{ sum.closed }}
              v-col
                span Сумма работ: {{ sum.worksPrice }}
              v-col
                span Сумма в кассу: {{ sum.cashPrice }}
    template(v-else)
      v-container.pa-8(fluid)
        v-alert(type='info') Сегодня ещё не было создано / закрыто заявок
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import moment from 'moment'
import { settingsModule, ordersModule } from '@/store'
import { cloneDeep, groupBy, sum, map, reduce, join } from 'lodash'
import JsonExcel from 'vue-json-excel'

@Component({
  components: {
    JsonExcel,
  },
})
export default class OReportsOrdersDaily extends Vue {
  @Prop(String) from!: string

  public reports: any = null
  public panels = [0, 1]

  public tableNewHeaders = [
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
  ]

  public tableClosedHeaders = [
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
  ]

  async getReport() {
    const search: any = {
      date: [moment().startOf('day').toISOString(), moment().endOf('day').toISOString()],
    }

    const response = await ordersModule.generateReport({ ...search, type: 'daily' })

    this.reports = response
  }

  get sum() {
    return {
      new: reduce(
        this.reports.new,
        (a, e: any) => {
          a += e.ordersTotal
          return a
        },
        0
      ),
      closed: reduce(
        this.reports.closed,
        (a, e: any) => {
          a += e.ordersTotal
          return a
        },
        0
      ),
      worksPrice: reduce(
        this.reports.closed,
        (a, e: any) => {
          a += e.cashSum
          return a
        },
        0
      ),
      cashPrice: reduce(
        this.reports.closed,
        (a, e: any) => {
          a += e.worksSum
          return a
        },
        0
      ),
    }
  }

  mounted() {
    this.getReport()
  }
}
</script>

<style lang="sass">
.report-orders-daily__
  &toolbar
    width: 100%
    align-items: center
</style>
