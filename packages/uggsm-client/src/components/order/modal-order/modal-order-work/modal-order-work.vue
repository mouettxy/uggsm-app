<template>
  <div v-if="order" class="ug-modal-order-work">
    <v-row>
      <v-col cols="12">
        <ug-modal-order-work-add :order="order" :is-order-closed="isOrderClosed"></ug-modal-order-work-add>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
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
              :disabled="isOrderClosed || !$can('deleteOrderWork', 'Global')"
              icon="mdi-trash-can"
              color="error"
              @click="handleDeleteWork(item)"
            ></ug-base-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import UgModalOrderWorkAdd from '@/components/order/modal-order/modal-order-work/modal-order-work-add/modal-order-work-add'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'

import OrderAPI from '@/api/order'

export default {
  name: 'ug-modal-order-work',

  components: {
    UgModalOrderWorkAdd,
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
  }),

  computed: {
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
