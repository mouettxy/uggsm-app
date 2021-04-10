<route>
{
  "name": "access",
  "meta": {
    "header": "Доступ к ресурсам"
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
    socket-event='access updated all',
    item-key-field='id',
    initial-sort-field='time',
    headers-id='access-headers-id',
    filter-name='access'
  )
</template>

<script>
import UgTableRemote from '@/components/base/table/table-remote/table-remote'

import { Filters } from '@/helpers/filterHelper'
import { map } from 'lodash'
import moment from 'moment'
import AccessAPI from '@/api/access'

export default {
  name: 'ug-page-access',

  components: {
    UgTableRemote,
  },

  data: function () {
    return {
      headersSchema: {
        user: 'Пользователь',
        time: 'Время',
        resource: 'Ресурс',
        action: 'Действие',
        ip: 'IP',
        os: 'ОС',
        browser: 'Браузер',
      },

      filterTokens: Filters.access,
    }
  },

  methods: {
    modifyItems(items) {
      return map(items, (e) => ({
        id: e._id,
        user: e.userCredentials,
        time: moment(e.time).format('DD MMMM YYYY'),
        resource: e.resource.value,
        action: e.action.value,
        ip: e.userIp,
        os: e.userOs,
        browser: e.userBrowser,
      }))
    },

    async fetchFunction(data) {
      const response = await AccessAPI.getPaginated(data)

      if (response.status !== 200) {
        this.$notification.error('Не удалось получить данные')
        return []
      }

      return response.data
    },
  },
}
</script>
