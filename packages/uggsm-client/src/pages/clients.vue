<route>
{
  "name": "clients",
  "meta": {
    "header": "Клиенты"
  }
}
</route>

<template lang="pug">
.page-orders
  ug-table-remote(
    ref='table',
    :modify-items-function='modifyItems',
    :headers-schema='headersSchema',
    :filter-tokens='filterTokens',
    :fetch-function='fetchFunction',
    socket-event='update clients',
    item-key-field='id',
    headers-id='clients-headers-id',
    filter-name='clients'
  )
    template(#item.name='{value, item}')
      v-list-item
        v-list-item-content
          v-list-item-title {{ value }}
          v-list-item-subtitle {{ item.type }}
    template(#item.phone='{value}')
      v-tooltip(
        v-for='v in value',
        :key='v.id',
        left
      )
        template(#activator='{on, attrs}')
          a.d-block(
            v-on='on',
            v-bind='attrs',
            :href='`tel:+7${v.phone}`'
          ) {{ v.phone | VMask("+7 (###) ###-##-##") }}
        span {{ v.comment }}
    template(#item.notifications='{value}')
      v-icon.pa-2(
        v-if='value.email',
        size='1.4rem',
        color='success'
      ) mdi-email-check
      v-icon.pa-2(
        v-if='value.sms',
        size='1.4rem',
        color='success'
      ) mdi-message
    template(#item.id='{value}')
      ug-modal-client(:clientid='value')
</template>

<script>
import UgTableRemote from '@/components/base/table/table-remote/table-remote'
import UgModalClient from '@/components/client/modal-client/modal-client'

import { Filters } from '@/helpers/filterHelper'
import { map } from 'lodash'
import moment from 'moment'
import ClientAPI from '@/api/client'

export default {
  name: 'ug-page-orders',

  components: {
    UgTableRemote,
    UgModalClient,
  },

  data: function () {
    return {
      headersSchema: {
        id: '№',
        name: 'Имя',
        email: 'Почта',
        phone: 'Телефон',
        address: 'Адрес',
        createdAt: 'Создан',
        notifications: 'Уведомления',
      },

      filterTokens: Filters.clients,
    }
  },

  methods: {
    modifyItems(items) {
      return map(items, (e) => ({
        id: e.id,
        createdAt: moment(e.createdAt).format('DD MMMM YYYY'),
        isProvider: e.isProvider,
        isConflict: e.isConflict,
        address: e.address,
        name: e.name,
        email: e.email,
        notifications: {
          email: e.allowedEmailNotifications,
          sms: e.allowedNotifications,
        },
        type: e.clientType,
        phone: e.phone,
      }))
    },

    async fetchFunction(data) {
      const response = await ClientAPI.getPaginatedNew(data)

      if (response.status !== 200) {
        this.$notification.error('Не удалось получить данные')
        return []
      }

      return response.data
    },
  },
}
</script>
