<template lang="pug">
.ug-report-orders-closed-incorrect
  v-card
    v-card-title Закрыто на 0
    v-card-text
      v-row(align='center')
        v-col(
          cols='12',
          md='5',
          lg='5'
        )
          ug-datetime-picker(
            v-model='search.date',
            range
          )
        v-col(
          cols='12',
          md='5',
          lg='5'
        )
          ug-select-many(
            v-model='search.status',
            :items='["Закрыт", "Готов"]',
            label='Статус'
          )
        v-col.text-center(
          cols='12',
          md='2',
          lg='2'
        )
          v-row
            v-col(cols='6')
              ug-base-btn(
                :loading='isLoading',
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
      .ug-report-orders-closed-incorrect__content(v-if='report && report.length')
        v-card.mb-4
          v-card-text
            .text-medium.text-center Итого: {{ sumOfReport }}

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
                      v-chip.dark--text(
                        small,
                        label,
                        color='error'
                      ) {{ report.length }}
                  v-expansion-panel-content
                    v-data-table.elevation-2.grey(
                      :items-per-page='Infinity',
                      :items='masterReport',
                      :headers='tableHeaders',
                      light,
                      hide-default-footer
                    )
</template>

<script>
import UgDatetimePicker from '@/components/base/ui/datetime-picker/datetime-picker'
import UgSelectMany from '@/components/base/ui/select-many/select-many'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import JsonExcel from 'vue-json-excel'

import OrderAPI from '@/api/order'

import moment from 'moment'
import { groupBy, flatten, cloneDeep } from 'lodash'

export default {
  name: 'ug-reports-orders-closed-incorrect',

  components: {
    JsonExcel,
    UgDatetimePicker,
    UgSelectMany,
    UgBaseBtn,
  },

  data: function () {
    return {
      isLoading: false,
      search: {
        date: [moment().format('DD.MM.YYYY'), moment().format('DD.MM.YYYY')],
        status: ['Закрыт'],
      },

      report: null,
      tableHeaders: [
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
      ],
    }
  },

  computed: {
    formattedReport() {
      if (!this.report) {
        return []
      }

      return this.report.map((report) => {
        const orders = report.orders
        const office = report.office
        const count = report.orders.length

        return {
          office,
          count,
          orders: groupBy(
            orders.map((e) => {
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
    },

    reportExcel() {
      const excelColumns = {
        Офис: 'office',
        Сотрудник: 'master',
        Менеджер: 'manager',
        'Дата открытия': 'createdAt',
        'Дата закрытия': 'closedAt',
        Заявка: 'id',
        'Полное название': 'product',
      }

      if (!this.report) {
        return {
          data: [],
          fields: excelColumns,
        }
      }

      const report = flatten(
        this.report.map((e) => {
          const report = e.orders
          const office = e.office

          return report.map((e) => {
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
        fields: excelColumns,
      }
    },

    sumOfReport() {
      if (!this.report) {
        return 0
      }

      return this.report.reduce((a, e) => {
        a += e.orders.length
        return a
      }, 0)
    },
  },

  methods: {
    async getReport() {
      this.isLoading = true
      this.report = null
      const search = cloneDeep(this.search)
      search.date[0] = moment(search.date[0], 'DD.MM.YYYY').startOf('day').toISOString()
      search.date[1] = moment(search.date[1], 'DD.MM.YYYY').endOf('day').toISOString()

      const response = await OrderAPI.generateReport({ ...search, type: 'without-work' })

      if (response.status !== 200) {
        this.$notification.error('Не удалось сгенерировать отчёт')
        return
      }

      if (!response.data.length) {
        this.$notification.warning('По заданному фильтру не удалось найти заявки')
        return
      }

      this.report = response.data
      this.isLoading = false
    },
  },
}
</script>
