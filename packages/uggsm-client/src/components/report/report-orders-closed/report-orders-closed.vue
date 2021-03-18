<template>
  <v-card class="ug-report-orders-closed">
    <v-card-title>Закрыто</v-card-title>
    <v-card-text>
      <v-row align="center">
        <v-col cols="12" lg="3" md="3">
          <ug-datetime-picker v-model="search.date" range></ug-datetime-picker>
        </v-col>
        <v-col cols="12" lg="4" md="4">
          <ug-base-select v-model="search.office" :items="offices" label="Офис"></ug-base-select>
        </v-col>
        <v-col cols="12" lg="3" md="3">
          <ug-base-select
            v-model="search.status"
            dense
            :items="['Закрыт', 'Готов']"
            label="Статус"
            multiple
          ></ug-base-select>
        </v-col>
        <v-col cols="12" lg="2" md="2">
          <v-row class="text-center">
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
      <div v-if="report && report.length" class="ug-report-orders-closed__content">
        <v-card class="mb-4">
          <v-card-text>
            <div class="text-medium text-center">Итого: {{ sumOfReport }}</div>
          </v-card-text>
        </v-card>
        <v-expansion-panels>
          <v-expansion-panel v-for="(reportItem, master) in formattedReport" :key="master">
            <v-expansion-panel-header>
              <strong>{{ master }}</strong>
              <template #actions>
                <v-chip class="dark--text mr-1" color="warning" label small>{{ reportItem.length }}</v-chip>
                <v-chip v-if="getSumOfReport(reportItem) > 0" class="dark--text" color="green" label small>
                  {{ getSumOfReport(reportItem) }}
                </v-chip>
                <v-chip v-else class="dark--text" color="green" label small>{{ getSumOfReport(reportItem) }}</v-chip>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-data-table
                class="elevation-2"
                :headers="tableHeaders"
                hide-default-footer
                :items="reportItem"
                :items-per-page="Infinity"
                show-expand
              >
                <template #expanded-item="{ item, headers }">
                  <td class="expanded-item__cell" :colspan="headers.length">
                    <v-data-table
                      class="elevation-1"
                      :headers="embeddedHeaders"
                      hide-default-footer
                      :items="item.works"
                    ></v-data-table>
                  </td>
                </template>
              </v-data-table>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </v-card-text>
  </v-card>
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

  mounted: function () {
    if (this.currentOffice) {
      this.search.office = this.currentOffice.code
    }

    this.fetchOffices()
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
}
</script>

<style lang="sass">
.ug-report-orders-closed

  .expanded-item__cell
    padding: 12px !important
</style>
