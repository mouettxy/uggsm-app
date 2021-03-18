<template>
  <div class="ug-report-orders-daily">
    <v-card>
      <v-card-title>Ежедневный отчёт</v-card-title>
      <v-card-text>
        <template v-if="report && report.new.length && report.closed.length">
          <v-card>
            <v-card-text class="text-medium text-center dark--text">
              <v-row>
                <v-col cols="12" lg="3" md="3">
                  <span>Итого новых: {{ sumOfReport.new }}</span>
                </v-col>
                <v-col cols="12" lg="3" md="3">
                  <span>Итого закрытых: {{ sumOfReport.closed }}</span>
                </v-col>
                <v-col cols="12" lg="3" md="3">
                  <span>Сумма работ: {{ sumOfReport.worksPrice }}</span>
                </v-col>
                <v-col cols="12" lg="3" md="3">
                  <span>Сумма в кассу: {{ sumOfReport.cashPrice }}</span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <div class="text-h6 my-4">Созданы сегодня</div>
          <v-expansion-panels>
            <v-expansion-panel v-for="reportNewItem in report.new" :key="reportNewItem.office">
              <v-expansion-panel-header>
                <strong>{{ reportNewItem.office }}</strong>
                <template #actions>
                  <v-chip class="dark--text" color="warning" label small>{{ reportNewItem.ordersTotal }}</v-chip>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-data-table
                  class="elevation-1"
                  :headers="tableNewHeaders"
                  hide-default-footer
                  :items="reportNewItem.orders"
                  :items-per-page="Infinity"
                  light
                >
                  <template #item.id="{ item }">
                    <template v-if="item.id">
                      <o-order-modal-regular :orderid="item.id">
                        <template #activator="{ on, attrs }">
                          <v-btn v-bind="attrs" icon v-on="on">
                            <v-icon>mdi-eye</v-icon>
                          </v-btn>
                        </template>
                      </o-order-modal-regular>
                    </template>
                  </template>
                </v-data-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <div class="text-h6 my-4">Закрыты сегодня</div>
          <v-expansion-panels>
            <v-expansion-panel v-for="reportClosedItem in report.closed" :key="reportClosedItem.office">
              <v-expansion-panel-header>
                <strong>{{ reportClosedItem.office }}</strong>
                <template #actions>
                  <v-row class="text-right" no-gutters>
                    <v-col cols="12" lg="auto" md="auto">
                      <v-tooltip bottom>
                        <template #activator="{ on, attrs }">
                          <v-chip class="dark--text" v-bind="attrs" color="success" label small v-on="on">
                            {{ reportClosedItem.worksSum }} / {{ reportClosedItem.cashSum }}
                          </v-chip>
                        </template>
                        <span>Работы / Касса</span>
                      </v-tooltip>
                    </v-col>
                    <v-col class="pl-0 pl-lg-1 pl-md-1" cols="12" lg="auto" md="auto">
                      <v-chip class="dark--text" color="warning" label small>{{ reportClosedItem.ordersTotal }}</v-chip>
                    </v-col>
                  </v-row>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-data-table
                  class="elevation-1"
                  :headers="tableClosedHeaders"
                  hide-default-footer
                  :items="reportClosedItem.orders"
                  :items-per-page="Infinity"
                  light
                >
                  <template #item.id="{ item }">
                    <template v-if="item.id">
                      <o-order-modal-regular :orderid="item.id">
                        <template #activator="{ on, attrs }">
                          <ug-base-btn v-bind="attrs" color="dark" icon="mdi-eye" v-on="on"></ug-base-btn>
                        </template>
                      </o-order-modal-regular>
                    </template>
                  </template>
                </v-data-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </template>
        <template v-else>
          <ug-base-alert persistent>Сегодня ещё не было создано или закрыто заявок</ug-base-alert>
        </template>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import UgBaseAlert from '@/components/base/ui/base-alert/base-alert'
import OOrderModalRegular from '@/components/organizms/modals/order/ModalRegular/OOrderModalRegular'
import OrderAPI from '@/api/order'
import moment from 'moment'

export default {
  name: 'ug-report-orders-daily',

  sockets: {
    ['update orders']() {
      this.getReport()
    },
  },

  components: {
    OOrderModalRegular,
    UgBaseAlert,
    UgBaseBtn,
  },

  data: function () {
    return {
      report: null,
      panels: [0, 1],
      tableNewHeaders: [
        {
          text: '№',
          value: 'id',
        },
        {
          text: 'Клиент',
          value: 'client',
        },
        {
          text: 'Модель',
          value: 'phone',
        },
        {
          text: 'Поломка',
          value: 'defect',
        },
      ],

      tableClosedHeaders: [
        {
          text: '№',
          value: 'id',
        },
        {
          text: 'Клиент',
          value: 'client',
        },
        {
          text: 'Модель',
          value: 'phone',
        },
        {
          text: 'Поломка',
          value: 'defect',
        },
        {
          text: 'Работы (руб.)',
          value: 'worksPrice',
        },
        {
          text: 'Касса (руб.)',
          value: 'cashPrice',
        },
      ],
    }
  },

  computed: {
    sumOfReport() {
      if (!this.report) {
        return {
          new: 0,
          closed: 0,
          worksPrice: 0,
          cashPrice: 0,
        }
      }

      return {
        new: this.report.new.reduce((a, e) => {
          a += e.ordersTotal
          return a
        }, 0),

        closed: this.report.closed.reduce((a, e) => {
          a += e.ordersTotal
          return a
        }, 0),

        worksPrice: this.report.closed.reduce((a, e) => {
          a += e.cashSum
          return a
        }, 0),

        cashPrice: this.report.closed.reduce((a, e) => {
          a += e.worksSum
          return a
        }, 0),
      }
    },
  },

  mounted: function () {
    this.getReport()
  },

  methods: {
    async getReport() {
      const search = {
        date: [moment().startOf('day').toISOString(), moment().endOf('day').toISOString()],
      }

      const response = await OrderAPI.generateReport({ ...search, type: 'daily' })

      if (response.status !== 200) {
        this.$notification.warning('За сегодняшний день не найдены заявки')
        return
      }

      this.report = response.data
    },
  },
}
</script>
