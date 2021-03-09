<template lang="pug">
v-card.ug-report-orders-closed
  v-card-title Закрыто
  v-card-text
    v-row(align='center')
      v-col(
        cols='12',
        md='3',
        lg='3'
      )
        ug-datetime-picker(
          v-model='search.date',
          range
        )
      v-col(
        cols='12',
        md='4',
        lg='4'
      )
        ug-base-select(
          v-model='search.office',
          :items='offices',
          label='Офис'
        )
      v-col(
        cols='12',
        md='3',
        lg='3'
      )
        ug-base-select(
          v-model='search.status',
          :items='["Закрыт", "Готов"]',
          multiple,
          label='Статус',
          dense
        )
      v-col(
        cols='12',
        md='2',
        lg='2'
      )
        v-row.text-center
          v-col(cols='6')
            ug-base-btn(
              @click='getReport',
              label='Выбрать',
              color='primary'
            ) 
          v-col(cols='6')
            json-excel.d-inline(
              :fields='reportExcel.fields',
              :data='reportExcel.data'
            )
              ug-base-btn(
                :disabled='!report || (report && !report.length)',
                icon='mdi-file-excel',
                color='primary'
              )
    .ug-report-orders-closed__content(v-if='report && report.length')
      v-card.mb-4
        v-card-text
          .text-medium.text-center Итого: {{ sumOfReport }}

      v-expansion-panels
        v-expansion-panel(
          v-for='(report, master) in formattedReport',
          :key='master'
        )
          v-expansion-panel-header
            strong {{ master }}
            template(#actions)
              v-chip.dark--text.mr-1(
                label,
                color='warning'
              ) {{ report.length }}

              v-chip.dark--text(
                v-if='getSumOfReport(report) > 0',
                label,
                color='green'
              ) {{ getSumOfReport(report) }}
              v-chip.dark--text(
                v-else,
                label,
                color='green'
              ) {{ getSumOfReport(report) }}

          v-expansion-panel-content
            v-data-table.elevation-2(
              :items-per-page='Infinity',
              :items='report',
              :headers='tableHeaders',
              show-expand,
              hide-default-footer
            )
              template(#expanded-item='{item, headers}')
                td.expanded-item__cell(:colspan='headers.length')
                  v-data-table.elevation-1(
                    :items='item.works',
                    :headers='embeddedHeaders',
                    hide-default-footer
                  )
</template>

<script>
import UgDatetimePicker from '@/components/base/ui/datetime-picker/datetime-picker'
import UgBaseSelect from '@/components/base/ui/base-select/base-select'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import JsonExcel from 'vue-json-excel'

import OfficeAPI from '@/api/office'
import OrderAPI from '@/api/order'

import moment from 'moment'
import { cloneDeep, groupBy } from 'lodash'
import { mapState } from 'vuex'

export default {
  name: 'ug-report-orders-closed',

  components: {
    JsonExcel,
    UgDatetimePicker,
    UgBaseSelect,
    UgBaseBtn,
  },

  data: function () {
    return {
      search: {
        date: [moment().format('DD.MM.YYYY'), moment().format('DD.MM.YYYY')],
        office: '',
        status: ['Закрыт'],
      },
      report: null,
      tableHeaders: [
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
      ],
      embeddedHeaders: [
        {
          text: 'Наименование',
          value: 'work',
        },
        {
          text: 'Заработок, руб',
          value: 'total',
        },
      ],
      officesRaw: [],
    }
  },

  computed: {
    ...mapState({
      currentOffice: (state) => state.settings.office,
    }),
    offices() {
      if (!this.officesRaw) {
        return []
      }

      return this.officesRaw.map((e) => {
        return {
          text: `${e.code}|${e.name}`,
          value: e.code,
        }
      })
    },

    formattedReport() {
      if (!this.report) {
        return []
      }

      return groupBy(
        this.report.map((e) => ({
          master: e.master,
          date: moment(e.date).format('DD MMMM YYYY'),
          product: e.product,
          price: e.price,
          total: e.total,
          works: e.works,
        })),
        'master'
      )
    },

    sumOfReport() {
      if (!this.report) {
        return 0
      }

      return this.report.reduce((a, e) => {
        a += e.total
        return a
      }, 0)
    },

    reportExcel() {
      const excelColumns = {
        Сотрудник: 'master',
        Дата: 'date',
        Тип: 'type',
        Наименование: 'product',
        'Выполненная работа': 'works',
        'Сумма, руб': 'price',
        'Заработок, руб': 'total',
      }

      if (!this.report) {
        return {
          data: [],
          fields: excelColumns,
        }
      }

      const report = this.report.map((e) => {
        const date = moment(e.date).format('DD.MM.YYYY')
        const works = e.works.map((e) => `${e.work} ${e.total} руб.`).join(' | ')

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
        fields: excelColumns,
      }
    },
  },

  methods: {
    async getReport() {
      const search = cloneDeep(this.search)
      search.date[0] = moment(search.date[0], 'DD.MM.YYYY').startOf('day').toISOString()
      search.date[1] = moment(search.date[1], 'DD.MM.YYYY').endOf('day').toISOString()
      search.office = search.office.split('|')[0]

      const response = await OrderAPI.generateReport(search)

      if (response.status !== 200) {
        this.$notification.error('Не удалось сгенерировать отчёт')
        return
      }

      if (!response.data.length) {
        this.$notification.error('По заданному фильтру не удалось найти заявки')
        return
      }

      this.report = response.data
    },

    getSumOfReport(report) {
      if (!report) {
        return 0
      }

      return report.map((e) => e.total).reduce((a, v) => a + v, 0)
    },

    async fetchOffices() {
      const response = await OfficeAPI.getAll()

      if (response.status !== 200) {
        this.$notification.error('Ошибка при получении списка офисов')
        return
      }

      this.officesRaw = response.data
    },
  },

  mounted: function () {
    if (this.currentOffice) {
      this.search.office = this.currentOffice.code
    }

    this.fetchOffices()
  },
}
</script>

<style lang="sass">
.ug-report-orders-closed

  .expanded-item__cell
    padding: 12px !important
</style>
