<template>
  <div class="report-orders-count">
    <v-card>
      <v-card-title>Создано</v-card-title>
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" lg="5" md="5">
            <ug-datetime-picker v-model="search.date" range></ug-datetime-picker>
          </v-col>
          <v-col cols="12" lg="5" md="5">
            <ug-select-many v-model="search.status" :items="statusList" label="Статус"></ug-select-many>
          </v-col>
          <v-col class="text-center" cols="12" lg="2" md="2">
            <v-row>
              <v-col cols="6">
                <ug-base-btn color="primary" label="Выбрать" @click="getReport"></ug-base-btn>
              </v-col>
              <v-col cols="6">
                <json-excel class="d-inline" :data="reportExcel.data" :fields="reportExcel.fields">
                  <ug-base-btn
                    color="primary"
                    :disabled="!report || (report && !report.length)"
                    icon="mdi-file-excel"
                  ></ug-base-btn>
                </json-excel>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <div v-if="report && report.length" class="ug-report-orders-count__content">
          <v-card class="mb-4">
            <v-card-text>
              <div class="text-medium text-center">Итого: {{ sumOfReport }}</div>
            </v-card-text>
          </v-card>
          <v-expansion-panels>
            <v-expansion-panel v-for="reportItem in report" :key="reportItem.office">
              <v-expansion-panel-header>
                <strong>{{ reportItem.office }}</strong>
                <template #actions>
                  <v-chip color="success" label small>{{ reportItem.count }}</v-chip>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <span>Статусы: {{ joinArray(reportItem.statuses) }}</span>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-card-text>
    </v-card>
  </div>
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
      const search = cloneDeep(this.search)
      search.date[0] = moment(search.date[0], 'DD.MM.YYYY').startOf('day').toISOString()
      search.date[1] = moment(search.date[1], 'DD.MM.YYYY').endOf('day').toISOString()

      const response = await OrderAPI.generateReport({ ...search, type: 'count' })

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
  },
}
</script>
