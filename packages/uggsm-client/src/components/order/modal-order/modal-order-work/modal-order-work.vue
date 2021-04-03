<template>
  <div class="ug-modal-order-work">
    <v-fade-transition hide-on-leave>
      <v-row v-if="!order" key="loading">
        <v-col cols="12" lg="auto" md="auto">
          <v-skeleton-loader type="button"></v-skeleton-loader>
        </v-col>
        <v-col cols="12">
          <v-skeleton-loader type="table-row-divider@3"></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row v-else key="loaded">
        <v-col cols="12" lg="auto" md="auto">
          <ug-modal-order-work-add :order="order" :is-order-closed="isOrderClosed"></ug-modal-order-work-add>
        </v-col>
        <v-col cols="12" lg="auto" md="auto">
          <ug-modal-order-detail-add :order="order" :is-order-closed="isOrderClosed"></ug-modal-order-detail-add>
        </v-col>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12" lg="6" md="6">
          <v-subheader>Закрытые работы</v-subheader>
          <v-data-table
            :items="order.statusWork"
            :headers="tableWorksHeaders"
            hide-default-footer
            no-data-text="Нет закрытых работ"
            mobile-breakpoint="0"
            dense
          >
            <!-- eslint-disable-next-line -->
            <template #item.actions="{ item }">
              <ug-base-btn
                :style="{ height: '31px' }"
                :disabled="isOrderClosed || !$can('deleteOrderWork', 'Global')"
                icon="mdi-trash-can"
                color="error"
                @click="handleDeleteWork(item)"
              ></ug-base-btn>
            </template>
            <!-- eslint-disable-next-line -->
            <template #body.append="">
              <tr>
                <td colspan="3" class="text-end text-medium">Итого:</td>
                <td colspan="2" class="text-medium">{{ totalWorks }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-col>
        <v-col cols="12" lg="6" md="6">
          <v-subheader>Используемые детали</v-subheader>
          <v-data-table
            :items="order.usedDetails"
            :headers="tableDetailsHeaders"
            show-expand
            hide-default-footer
            no-data-text="Нет используемых деталей"
            mobile-breakpoint="0"
            dense
          >
            <!-- eslint-disable-next-line -->
            <template #expanded-item="{ item }">
              <td v-md colspan="5" class="ug-markdown-content table_lightgrey">
                {{ item.description }}
              </td>
            </template>
            <!-- eslint-disable-next-line -->
            <template #body.append="">
              <tr>
                <td colspan="4" class="text-end text-medium">Итого:</td>
                <td class="text-medium">{{ totalDetails }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-fade-transition>
  </div>
</template>

<script>
import UgModalOrderWorkAdd from '@/components/order/modal-order/modal-order-work/modal-order-work-add/modal-order-work-add'
import UgModalOrderDetailAdd from '@/components/order/modal-order/modal-order-work/modal-order-detail-add/modal-order-detail-add'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'

import OrderAPI from '@/api/order'
import { reduce } from 'lodash'

export default {
  name: 'ug-modal-order-work',

  components: {
    UgModalOrderWorkAdd,
    UgModalOrderDetailAdd,
    UgBaseBtn,
  },

  props: {
    order: {
      required: false,
      type: Object,
      default: () => ({}),
    },
  },

  data: () => ({
    tableWorksHeaders: [
      {
        text: '№',
        value: 'id',
      },
      {
        text: 'Мастер',
        value: 'credentials',
      },
      {
        text: 'Название',
        value: 'header',
      },
      {
        text: 'Цена',
        value: 'price',
      },
      {
        text: 'Действия',
        value: 'actions',
      },
    ],

    tableDetailsHeaders: [
      {
        text: '№',
        value: 'id',
      },
      {
        text: 'Добавил',
        value: 'credentials',
      },
      {
        text: 'Запчасть (-и)',
        value: 'header',
      },
      {
        text: 'Цена',
        value: 'price',
      },
    ],
  }),

  computed: {
    totalWorks() {
      if (this.order) {
        return reduce(
          this.order.statusWork,
          (a, e) => {
            a += e.price
            return a
          },
          0
        )
      }

      return 0
    },

    totalDetails() {
      if (this.order) {
        return reduce(
          this.order.usedDetails,
          (a, e) => {
            a += e.price
            return a
          },
          0
        )
      }

      return 0
    },

    isOrderClosed() {
      if (this.$can('manage', 'all')) {
        return false
      }

      if (this.order?.status === 'Закрыт') {
        return true
      }

      return false
    },
  },

  methods: {
    async handleDeleteWork(tableItem) {
      const response = await OrderAPI.deleteCompletedWork(this.order.id, tableItem.id)

      if (response.status !== 200) {
        this.$notification.error(`Не удалось удалить работу "${tableItem.header}"`)
        return
      }

      this.$notification.success(`Работа "${tableItem.header}" успешно удалена`)
    },
  },
}
</script>
