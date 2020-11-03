<template lang="pug">
.report-orders-count
  v-card
    v-row.fill-height.report-orders-count__toolbar
      v-col(cols='2')
        v-card-title Создано
      v-col(cols='3')
        a-datetime-picker-2(
          v-model='search.date',
          range
        )
      v-col(cols='3')
        a-select(
          v-model='search.status',
          :items='statusList',
          multiple,
          label='Статус',
          dense
        )
      v-col.text-right(cols='4')
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
      v-container.pa-8(
        v-if='report && report.length',
        fluid
      )
        v-expansion-panels
          v-expansion-panel(
            v-for='report in report',
            :key='report.office'
          )
            v-expansion-panel-header
              strong {{ report.office }}
              template(#actions)
                strong.success--text {{ report.count }}
            v-expansion-panel-content
              span Статусы: {{ concat(report.statuses) }}
        v-card.mt-4
          v-card-text
            .text-h5.text-right Итого: {{ sum }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import moment from 'moment'
import { cloneDeep, reduce, join, map } from 'lodash'
import { ordersModule } from '@/store'
import JsonExcel from 'vue-json-excel'

@Component({
  components: {
    JsonExcel,
  },
})
export default class OReportsOrdersCount extends Vue {
  public search = {
    date: [moment().format('DD.MM.YYYY'), moment().format('DD.MM.YYYY')],
    status: [],
  }
  public report = null
  public statusList = [
    'Отремонтирован',
    'Новый',
    'В работе',
    'На тестировании',
    'На уточнении',
    'Позвонить повторно',
    'Ждёт запчасть',
    'Нужно решить',
    'Готов',
    'Готов, без ремонта',
    'На продаже',
    'Закрыт',
    'Выкуплен СЦ',
    'Обещали найти',
    'Закрыт с вопросом',
  ]

  get reportExcel() {
    const data = map(this.report, (e: any) => {
      return {
        office: e.office,
        total: e.count,
        statuses: this.concat(e.statuses),
      }
    })
    return {
      data: data,
      fields: {
        Офис: 'office',
        Количество: 'total',
        'Включает статусы': 'statuses',
      },
    }
  }

  get sum() {
    if (this.report) {
      return reduce(
        this.report,
        (a, e: any) => {
          a += e.count
          return a
        },
        0
      )
    }

    return 0
  }

  concat(arr: Array<string>) {
    return join(arr, ', ')
  }

  async getReport() {
    const search = cloneDeep(this.search)
    search.date[0] = moment(search.date[0], 'DD.MM.YYYY').startOf('day').toISOString()
    search.date[1] = moment(search.date[1], 'DD.MM.YYYY').endOf('day').toISOString()

    const response = await ordersModule.generateReport({ ...search, type: 'count' })

    this.report = response
  }
}
</script>

<style lang="sass">
.report-orders-count__
  &toolbar
    width: 100%
    align-items: center
</style>
