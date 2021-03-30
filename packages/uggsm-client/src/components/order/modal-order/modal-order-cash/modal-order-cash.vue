<template>
  <div class="modal-order-cash">
    <v-expand-transition>
      <v-row v-if="!order" key="loading">
        <v-col cols="6" lg="auto" md="auto">
          <v-skeleton-loader type="button"></v-skeleton-loader>
        </v-col>
        <v-col cols="6" lg="auto" md="auto">
          <v-skeleton-loader type="button"></v-skeleton-loader>
        </v-col>
        <v-col cols="12">
          <v-skeleton-loader type="table-row-divider@3"></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row v-else key="loaded">
        <v-slide-x-transition appear>
          <v-col v-if="!hasMasterField" cols="12">
            <ug-base-alert class="mb-0" type="error" persistent>
              Невозможно добавить приход в кассу из-за отсутствия указанного мастера в заказе. Укажите мастера и
              обновите заявку.
            </ug-base-alert>
          </v-col>
        </v-slide-x-transition>
        <v-slide-x-transition appear>
          <v-col v-if="!hasMasterField" cols="12">
            <ug-base-alert class="mb-0" type="error" persistent>
              Невозможно добавить расход в кассу из-за отсутствия указанного мастера в заказе. Укажите мастера и
              обновите заявку.
            </ug-base-alert>
          </v-col>
        </v-slide-x-transition>
        <v-col cols="6" lg="auto" md="auto">
          <ug-modal-cash-income
            v-if="displayIncome"
            :order-id="order.id"
            :customer="order.customer"
          ></ug-modal-cash-income>
        </v-col>
        <v-col cols="6" lg="auto" md="auto">
          <ug-modal-cash-consumption
            v-if="displayConsumption"
            :order-id="order.id"
            :customer="order.customer"
          ></ug-modal-cash-consumption>
        </v-col>
        <v-col cols="12">
          <v-data-table
            :items="cashes"
            :headers="tableCash"
            no-data-text="Нет записей в кассе"
            hide-default-footer
            mobile-breakpoint="0"
            dense
          >
            <!-- eslint-disable-next-line -->
            <template #body.append="">
              <tr>
                <td colspan="2" class="text-end text-medium">Итого:</td>
                <td class="text-medium">{{ totalCash }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-expand-transition>
  </div>
</template>

<script>
import UgModalCashConsumption from '@/components/cash/modal-cash-consumption/modal-cash-consumption'
import UgModalCashIncome from '@/components/cash/modal-cash-income/modal-cash-income'
import UgBaseAlert from '@/components/base/ui/base-alert/base-alert'

import { map, reduce } from 'lodash'
import moment from 'moment'

export default {
  name: 'ug-modal-order-cash',

  components: {
    UgBaseAlert,
    UgModalCashConsumption,
    UgModalCashIncome,
  },

  props: {
    order: {
      required: false,
      type: Object,
      default: () => ({}),
    },
  },

  data: () => ({
    tableCash: [
      {
        text: 'Дата',
        value: 'createdAt',
        show: true,
      },
      {
        text: 'Комментарий',
        value: 'comment',
        show: true,
      },
      {
        text: 'Сумма',
        value: 'total',
        show: true,
      },
    ],
  }),

  computed: {
    totalCash() {
      return reduce(
        this.cashes,
        (a, e) => {
          a += e.total
          return a
        },
        0
      )
    },

    cashes() {
      return map(this.order.cash, (e) => {
        return {
          id: e.id,
          createdAt: moment(e.createdAt).format('DD MMMM YYYY HH:mm'),
          comment: e.comment,
          total: e.income - e.consumption,
          consumption: e.consumption,
          orderid: e.orderid,
        }
      })
    },

    displayIncome() {
      return this.$can('addOrderIncome', 'Global') && this.displayActions
    },

    displayConsumption() {
      return this.$can('addOrderConsumption', 'Global') && this.displayActions
    },

    displayActions() {
      if (this.order?.closedAt || !this.hasMasterField) {
        return false
      }

      return true
    },

    hasMasterField() {
      if (!this.order?.master?._id) {
        return false
      }

      return true
    },
  },
}
</script>
