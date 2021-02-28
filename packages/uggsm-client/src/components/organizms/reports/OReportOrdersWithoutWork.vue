<template lang="pug">
.report-orders-without-work
  v-card
    v-card-title Закрыто на 0
    v-row.report-orders-without-work__toolbar
      v-col(cols='5')
        ug-datetime-picker.pl-4(
          v-model='search.date',
          range
        )
      v-col(cols='5')
        ug-base-select(
          v-model='search.status',
          :items='["Закрыт", "Готов"]',
          multiple,
          label='Статус',
          dense
        )
      v-col.text-right(cols='2')
        v-btn.mx-1(
          @click='getReport',
          color='primary'
        ) Выбрать
        json-excel.d-inline(
          :fields='reportExcel.fields',
          :data='reportExcel.data'
        )
          v-btn.mx-1(
            :disabled='!report',
            icon,
            color='primary'
          )
            v-icon mdi-file-excel
    v-container(
      v-if='report && report.length',
      fluid
    )
      v-expansion-panels
        v-expansion-panel(
          v-for='report in formattedReport',
          :key='report.office'
        )
          v-expansion-panel-header
            strong {{ report.office }}
            template(#actions)
              strong.error--text {{ report.count }}
          v-expansion-panel-content
            v-expansion-panels(dark)
              v-expansion-panel.secondary(v-for='(masterReport, master) in report.orders')
                v-expansion-panel-header
                  strong {{ master }}
                  template(#actions)
                    strong.error--text {{ masterReport.length }}
                v-expansion-panel-content
                  v-data-table.elevation-2.grey(
                    :items-per-page='99999',
                    :items='masterReport',
                    :headers='tableHeaders',
                    light,
                    hide-default-footer
                  )
      v-card.mt-4
        v-card-text
          .text-h5.text-right Итого: {{ sum }}
</template>

<script lang="ts">
import UgDatetimePicker from '@/components/base/ui/datetime-picker/datetime-picker.vue'
import UgBaseSelect from '@/components/base/ui/base-select/base-select.vue'

import { Component, Vue } from 'vue-property-decorator'
import moment from 'moment'
import { ordersModule } from '@/store'
import { cloneDeep, groupBy, map, reduce, flatten } from 'lodash'
import JsonExcel from 'vue-json-excel'

@Component({
  components: {
    JsonExcel,
    UgDatetimePicker,
    UgBaseSelect,
  },
})
export default class OReportsOrdersWithoutWork extends Vue {
  public search: {
    date: Array<Date | string>
    status: string[]
  } = {
    date: [moment().format('DD.MM.YYYY'), moment().format('DD.MM.YYYY')],
    status: ['Закрыт'],
  }
  public report = null
  public tableHeaders = [
    {
      text: '№',
      value: 'id',
    },
    {
      text: 'Мастер',
      value: 'master',
    },
    {
      text: 'Менеджер',
      value: 'manager',
    },
    {
      text: 'Закрыто',
      value: 'closedAt',
    },
    {
      text: 'Открыто',
      value: 'createdAt',
    },
    {
      text: 'Продукт',
      value: 'product',
    },
  ]

  get formattedReport() {
    return map(this.report, (report: any) => {
      const orders = report.orders
      const office = report.office
      const count = report.orders.length
      return {
        office,
        count,
        orders: groupBy(
          map(orders, (e: any) => {
            const createdAt = moment(e.createdAt).format('DD.MM.YYYY')
            const closedAt = moment(e.closedAt).format('DD.MM.YYYY')

            return {
              office,
              createdAt,
              closedAt,
              master: e.master,
              manager: e.manager,
              id: e.id,
              product: e.product,
            }
          }),
          'master'
        ),
      }
    })
  }

  get reportExcel() {
    const report = flatten(
      map(this.report, (el: any) => {
        const report = el.orders
        const office = el.office
        return map(report, (e: any) => {
          const createdAt = moment(e.createdAt).format('DD.MM.YYYY')
          const closedAt = moment(e.closedAt).format('DD.MM.YYYY')

          return {
            office,
            createdAt,
            closedAt,
            master: e.master,
            manager: e.manager,
            id: e.id,
            product: e.product,
          }
        })
      })
    )

    return {
      data: report,
      fields: {
        Офис: 'office',
        Сотрудник: 'master',
        Менеджер: 'manager',
        'Дата открытия': 'createdAt',
        'Дата закрытия': 'closedAt',
        Заявка: 'id',
        'Полное название': 'product',
      },
    }
  }

  get sum() {
    return reduce(
      this.report,
      (a, e: any) => {
        a += e.orders.length
        return a
      },
      0
    )
  }

  async getReport() {
    const search = cloneDeep(this.search)
    search.date[0] = moment(search.date[0], 'DD.MM.YYYY').startOf('day').toISOString()
    search.date[1] = moment(search.date[1], 'DD.MM.YYYY').endOf('day').toISOString()

    const response = await ordersModule.generateReport({ ...search, type: 'without-work' })

    this.report = response
  }
}
</script>

<style lang="sass">
.report-orders-without-work__
  &toolbar
    width: 100%
    align-items: center
</style>
