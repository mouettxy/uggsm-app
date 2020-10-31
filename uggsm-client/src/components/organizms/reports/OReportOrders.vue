<template lang="pug">
.orders-report
  v-card
    v-card-text
      v-row.fill-height.orders-report__row
        v-col(cols='1')
          v-card-title Заявки
        v-col(cols='3')
          date-picker(
            v-model='search.date',
            :clearable='false',
            value-type='format',
            range,
            placeholder='дату',
            format='DD.MM.YYYY'
          )
            template(#input='{props}')
              a-input(
                v-model='props.value',
                label='За дату',
                hide-details,
                dense
              )
            template(#icon-calendar)
              span
        v-col(cols='3')
          m-office-switcher(v-model='search.office')
        v-col(cols='3')
          a-select(
            v-model='search.status',
            :items='["Закрыт", "Готов"]',
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
              color='primary'
            )
              v-icon mdi-file-excel
              span Экспорт
      v-container(
        v-if='report && report.length',
        fluid
      )
        v-expansion-panels
          v-expansion-panel(
            v-for='(report, master) in formattedReport',
            :key='master'
          )
            v-expansion-panel-header
              strong {{ master }}
              template(#actions)
                strong.success--text(v-if='getSumOfReport(report) > 0') {{ getSumOfReport(report) }}
                strong.error--text(v-else) {{ getSumOfReport(report) }}
                strong.warning--text.ml-1 {{ report.length }}
            v-expansion-panel-content
              v-data-table.elevation-2(
                :items='report',
                :headers='tableHeaders',
                show-expand,
                items-per-page='10000',
                hide-default-footer
              )
                template(#expanded-item='{item, headers}')
                  td.expanded-item__cell(:colspan='headers.length')
                    v-data-table.elevation-1(
                      :items='item.works',
                      :headers='embeddedHeaders',
                      hide-default-footer
                    )
        v-card.mt-4
          v-card-text
            .text-h5.text-right Итого: {{ sumOfReport }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DatePicker from 'vue2-datepicker'
import '@/sass/vue2-datepicker.sass'
import 'vue2-datepicker/locale/ru'
import moment from 'moment'
import { settingsModule, ordersModule } from '@/store'
import { cloneDeep, groupBy, sum, map, reduce, join } from 'lodash'
import JsonExcel from 'vue-json-excel'

@Component({
  components: {
    DatePicker,
    JsonExcel,
  },
})
export default class OOrdersReport extends Vue {
  public search: {
    date: Array<Date | string>
    office: string
    status: string
    firstDate: string
    secondDate: string
  } = {
    date: [moment().format('DD.MM.YYYY'), moment().format('DD.MM.YYYY')],
    office: '',
    status: 'Закрыт',
    firstDate: '',
    secondDate: '',
  }
  public report = null
  public tableHeaders = [
    {
      text: 'Дата и время',
      value: 'date',
    },
    {
      text: 'Наименование',
      value: 'product',
    },
    {
      text: 'Сумма, руб',
      value: 'price',
    },
    {
      text: 'Заработок, руб',
      value: 'total',
    },
  ]
  public embeddedHeaders = [
    {
      text: 'Наименование',
      value: 'work',
    },
    {
      text: 'Заработок, руб',
      value: 'total',
    },
  ]

  get formattedReport() {
    return groupBy(
      map(this.report, (e: any) => {
        return {
          master: e.master,
          date: moment(e.date).format('DD MMMM YYYY'),
          product: e.product,
          price: e.price,
          total: e.total,
          works: e.works,
        }
      }),
      'master'
    )
  }

  get sumOfReport() {
    return reduce(
      this.report,
      (a: number, e: any) => {
        a += e.total
        return a
      },
      0
    )
  }

  get reportExcel() {
    const report = map(this.report, (e: any) => {
      const date = moment(e.date).format('DD.MM.YYYY')
      const works = join(
        map(e.works, (e) => `${e.work} ${e.total} руб.`),
        ' | '
      )
      return {
        master: e.master,
        date,
        works,
        type: e.type,
        product: e.product,
        price: e.price,
        total: e.total,
      }
    })
    return {
      data: report,
      fields: {
        Сотрудник: 'master',
        Дата: 'date',
        Тип: 'type',
        Наименование: 'product',
        'Выполненная работа': 'works',
        'Сумма, руб': 'price',
        'Заработок, руб': 'total',
      },
    }
  }

  async getReport() {
    const search = cloneDeep(this.search)
    //@ts-ignore
    search.firstDate = moment(search.date[0], 'DD.MM.YYYY').startOf('day').toISOString()
    //@ts-ignore
    search.secondDate = moment(search.date[1], 'DD.MM.YYYY').endOf('day').toISOString()
    search.office = search.office.split('|')[0]

    const response = await ordersModule.generateReport(search)

    this.report = response
  }

  getSumOfReport(report: any) {
    return sum(map(report, (e) => e.total))
  }

  mounted() {
    if (settingsModule.office) {
      this.search.office = `${settingsModule.office.code}|${settingsModule.office.name}`
    }
  }
}
</script>

<style lang="sass">
.orders-report
  &__row
    width: 100%
    align-items: center
  .expanded-item__cell
    padding-left: 64px !important
    padding-right: 12px !important
    padding-top: 24px !important
    padding-bottom: 24px !important
</style>
