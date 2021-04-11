<template>
  <v-card class="ug-report-orders-closed">
    <v-card-title>Закрыто</v-card-title>
    <v-card-text>
      <v-row align="center">
        <v-col cols="12" md="3" lg="3">
          <ug-datetime-picker v-model="search.date" range="range"></ug-datetime-picker>
        </v-col>
        <v-col cols="12" md="4" lg="4">
          <ug-base-select v-model="search.office" :items="offices" label="Офис"></ug-base-select>
        </v-col>
        <v-col cols="12" md="3" lg="3">
          <ug-select-many
            v-model="search.status"
            :items="['Закрыт', 'Готов']"
            multiple="multiple"
            label="Статус"
            dense
          ></ug-select-many>
        </v-col>
        <v-col cols="12" md="2" lg="2">
          <v-row class="text-center">
            <v-col cols="6">
              <ug-base-btn label="Выбрать" :loading="isLoading" color="primary" @click="getReport"></ug-base-btn>
            </v-col>
            <v-col cols="6">
              <json-excel class="d-inline" :fields="reportExcel.fields" :data="reportExcel.data">
                <ug-base-btn
                  :disabled="!report || (report && !report.length)"
                  icon="mdi-file-excel"
                  color="primary"
                ></ug-base-btn>
              </json-excel>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div v-if="report && report.length" class="ug-report-orders-closed__content">
        <v-card class="mb-4">
          <v-card-text>
            <div class="text-medium">
              <v-row>
                <v-col cols="12" lg="6" md="6" class="text-right">
                  Детали / Работы /
                  <span class="success--text">Прибыль</span>
                </v-col>
                <v-col cols="12" lg="6" md="6" class="text-left">
                  {{ sumOfReport.details }} руб. / {{ sumOfReport.works }} руб. /
                  <span class="success--text">{{ sumOfReport.total }} руб.</span>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
        <v-expansion-panels>
          <v-expansion-panel v-for="(report, master) in formattedReport" :key="master">
            <v-expansion-panel-header>
              <strong>{{ master }}</strong>
              <template #actions>
                <v-chip class="dark--text mr-1" small="small" label="label" color="warning">{{ report.length }}</v-chip>
                <v-chip class="dark--text" color="green" small="small" label="label">
                  {{ getSumOfReport(report) }}
                </v-chip>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-data-table
                class="elevation-2"
                :items-per-page="Infinity"
                :items="report"
                :headers="tableHeaders"
                show-expand="show-expand"
                hide-default-footer="hide-default-footer"
              >
                <template #expanded-item="{ item, headers }">
                  <td class="expanded-item__cell" :colspan="headers.length">
                    <v-row>
                      <v-col cols="12" lg="6" md="6">
                        <v-subheader>Выполненные работы</v-subheader>
                        <v-data-table
                          class="elevation-1"
                          :items="item.works"
                          :headers="worksHeaders"
                          hide-default-footer="hide-default-footer"
                        ></v-data-table>
                      </v-col>
                      <v-col cols="12" lg="6" md="6">
                        <v-subheader>Использованные детали</v-subheader>
                        <v-data-table
                          class="elevation-1"
                          :items="item.details"
                          :headers="detailsHeaders"
                          hide-default-footer="hide-default-footer"
                        ></v-data-table>
                      </v-col>
                    </v-row>
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
import UgSelectMany from '@/components/base/ui/select-many/select-many'

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
    UgSelectMany,
    UgBaseBtn,
  },

  data: function () {
    return {
      isLoading: false,

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
          text: 'Детали, руб',
          value: 'detailsPrice',
        },
        {
          text: 'Работы, руб',
          value: 'worksPrice',
        },
        {
          text: 'Прибыль, руб',
          value: 'total',
        },
      ],

      worksHeaders: [
        {
          text: 'Наименование',
          value: 'work',
        },
        {
          text: 'Заработок, руб',
          value: 'total',
        },
      ],

      detailsHeaders: [
        {
          text: 'Наименование',
          value: 'detail',
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
          text: `${e.code} | ${e.name}`,
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
          works: e.works,
          details: e.details,
          detailsPrice: e.detailsPrice,
          worksPrice: e.worksPrice,
          total: e.worksPrice - e.detailsPrice,
        })),
        'master'
      )
    },

    sumOfReport() {
      if (!this.report) {
        return [0, 0, 0]
      }

      const sum = {
        details: this.report.reduce((a, e) => a + e.detailsPrice, 0),
        works: this.report.reduce((a, e) => a + e.worksPrice, 0),
      }

      sum.total = sum.works - sum.details

      return sum
    },

    reportExcel() {
      const excelColumns = {
        Сотрудник: 'master',
        Дата: 'date',
        Тип: 'type',
        Наименование: 'product',
        'Выполненная работа': 'works',
        'Использованные детали': 'details',
        'Стоимость деталей': 'detailsPrice',
        'Стоимость работ': 'worksPrice',
        'Прибыль, руб': 'total',
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
        const details = e.details.map((e) => (Object.keys(e).length ? `${e.detail} ${e.total} руб.` : '')).join(' | ')
        const total = e.worksPrice - e.detailsPrice

        return {
          master: e.master,
          date,
          works,
          details,
          type: e.type,
          product: e.product,
          detailsPrice: e.detailsPrice,
          worksPrice: e.worksPrice,
          total,
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
      this.isLoading = true
      this.report = null

      const search = cloneDeep(this.search)
      search.date[0] = moment(search.date[0], 'DD.MM.YYYY').startOf('day').toISOString()
      search.date[1] = moment(search.date[1], 'DD.MM.YYYY').endOf('day').toISOString()
      search.office = search.office.split('|')[0]
      search.type = 'profit'

      const response = await OrderAPI.generateReport(search)

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

    getSumOfReport(report) {
      if (!report) {
        return 0
      }

      const works = report.map((e) => e.worksPrice).reduce((a, v) => a + v, 0)
      const details = report.map((e) => e.detailsPrice).reduce((a, v) => a + v, 0)
      const total = works - details

      return [details, works, total].join(' / ')
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

  .v-data-table
    .v-data-table__expanded
      box-shadow: none !important

  .expanded-item__cell
    padding: 12px !important
</style>
