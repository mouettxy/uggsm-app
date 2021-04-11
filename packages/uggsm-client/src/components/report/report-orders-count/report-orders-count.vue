<template lang="pug">
.report-orders-count
  v-card
    v-card-title Создано
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
            :items='statusList',
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

      .ug-report-orders-count__content(v-if='report && report.length')
        v-card.mb-4
          v-card-text
            .text-medium.text-center Итого: {{ sumOfReport }}

        v-expansion-panels
          v-expansion-panel(
            v-for='report in report',
            v-if='$can("seeOffices", "Global", report.office.split("|")[1])',
            :key='report.office'
          )
            v-expansion-panel-header
              strong {{ report.office }}
              template(#actions)
                v-chip(
                  small,
                  label,
                  color='success'
                ) {{ report.count }}
            v-expansion-panel-content
              span Статусы: {{ joinArray(report.statuses) }}
</template>

<script>
import UgDatetimePicker from '@/components/base/ui/datetime-picker/datetime-picker'
import UgSelectMany from '@/components/base/ui/select-many/select-many'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import JsonExcel from 'vue-json-excel'

import OrderAPI from '@/api/order'

import moment from 'moment'
import { statuses } from '@/api/helpers/enums'
import { cloneDeep } from 'lodash'

export default {
  name: 'ug-report-orders-count',

  components: {
    JsonExcel,
    UgDatetimePicker,
    UgSelectMany,
    UgBaseBtn,
  },

  data: function () {
    return {
      isLoading: false,
      statusList: statuses,
      report: null,
      search: {
        date: [moment().format('DD.MM.YYYY'), moment().format('DD.MM.YYYY')],
        status: [],
      },
    }
  },

  computed: {
    joinedReportStatuses() {
      if (!this.report || (this.report && !this.report.statuses)) {
        return ''
      }

      return this.report.statuses.join(', ')
    },

    reportExcel() {
      const excelColumns = {
        Офис: 'office',
        Количество: 'total',
        'Включает статусы': 'statuses',
      }

      if (!this.report) {
        return {
          data: [],
          fields: excelColumns,
        }
      }

      const report = this.report.map((e) => {
        return {
          office: e.office,
          total: e.count,
          statuses: this.joinArray(e.statuses),
        }
      })

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
        a += e.count
        return a
      }, 0)
    },
  },

  methods: {
    joinArray(arr) {
      if (!arr) {
        return ''
      }

      return arr.join(', ')
    },

    async getReport() {
      this.isLoading = true
      this.report = null
      const search = cloneDeep(this.search)
      search.date[0] = moment(search.date[0], 'DD.MM.YYYY').startOf('day').toISOString()
      search.date[1] = moment(search.date[1], 'DD.MM.YYYY').endOf('day').toISOString()

      const response = await OrderAPI.generateReport({ ...search, type: 'count' })

      if (response.status !== 200) {
        this.$notification.error('Не удалось сгенерировать отчёт')
        this.isLoading = false
        return
      }

      if (!response.data.length) {
        this.$notification.warning('По заданному фильтру не удалось найти заявки')
        this.isLoading = false
        return
      }

      this.report = response.data
      this.isLoading = false
    },
  },
}
</script>
