<template>
  <div class="ug-report-orders-closed-incorrect">
    <v-card>
      <v-card-title>Закрыто на 0</v-card-title>
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" lg="5" md="5">
            <ug-datetime-picker v-model="search.date" range></ug-datetime-picker>
          </v-col>
          <v-col cols="12" lg="5" md="5">
            <ug-select-many v-model="search.status" :items="['Закрыт', 'Готов']" label="Статус"></ug-select-many>
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
        <div v-if="report && report.length" class="ug-report-orders-closed-incorrect__content">
          <v-card class="mb-4">
            <v-card-text>
              <div class="text-medium text-center">Итого: {{ sumOfReport }}</div>
            </v-card-text>
          </v-card>
          <v-expansion-panels>
            <v-expansion-panel v-for="reportItem in formattedReport" :key="reportItem.office">
              <v-expansion-panel-header>
                <strong>{{ reportItem.office }}</strong>
                <template #actions>
                  <strong class="error--text">{{ reportItem.count }}</strong>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-expansion-panels dark>
                  <v-expansion-panel v-for="(masterReport, master) in reportItem.orders" class="secondary">
                    <v-expansion-panel-header>
                      <strong>{{ master }}</strong>
                      <template #actions>
                        <v-chip class="dark--text" color="error" label small>{{ reportItem.length }}</v-chip>
                      </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-data-table
                        class="elevation-2 grey"
                        :headers="tableHeaders"
                        hide-default-footer
                        :items="masterReport"
                        :items-per-page="Infinity"
                        light
                      ></v-data-table>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
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
      const search = cloneDeep(this.search)
      search.date[0] = moment(search.date[0], 'DD.MM.YYYY').startOf('day').toISOString()
      search.date[1] = moment(search.date[1], 'DD.MM.YYYY').endOf('day').toISOString()

      const response = await OrderAPI.generateReport({ ...search, type: 'without-work' })

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
