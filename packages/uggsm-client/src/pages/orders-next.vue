<route>
{
  "name": "ordersNext",
  "meta": {
    "header": "[Beta] Заказы"
  }
}
</route>

<template>
  <div class="page-orders">
    <ug-table-remote
      :fetch-function="fetchFunction"
      :headers-schema="headersSchema"
      headers-schema-id="orders-id"
      include-header
      include-middle-toolbar
      include-office-field
      include-search-field
      socket-event="orders updated"
    ></ug-table-remote>
  </div>
</template>

<script>
import UgTableRemote from '@/components/base/table/table-remote/table-remote'

import OrderAPI from '@/api/order'
import { mapState } from 'vuex'

export default {
  name: 'ug-page-orders',

  components: {
    UgTableRemote,
  },

  data: function () {
    return {
      headersSchema: {
        id: '№',
        estimatedCloseAt: 'Срок заказа',
        status: 'Статус',
        client: 'Клиент',
        master: 'Мастер',
        created: 'Создан',
        phoneBrand: 'Бренд',
        phoneModel: 'Устройство',
        declaredDefect: 'Неисправность',
        totalWorks: 'Сумма работ',
        password: 'Пароль',
        notifications: 'Уведомления',
        adversitement: 'Рекламная кампания',
      },
    }
  },

  computed: {
    ...mapState({
      office: (state) => state.settings.office,
    }),
  },

  methods: {
    async fetchFunction(data) {
      const response = await OrderAPI.getPaginated({
        ...data,
        office: this.office._id,
      })

      if (response.status !== 200) {
        this.$notification.error('Не удалось получить данные')
        return []
      }

      return response.data
    },
  },
}
</script>
