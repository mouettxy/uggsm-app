<route>
{
  "name": "calls",
  "meta": {
    "header": "Звонки"
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
    socket-event='orders updated',
    item-key-field='id',
    initial-sort-field='answerTime',
    include-search-field,
    include-office-field,
    include-middle-toolbar,
    include-header,
    headers-id='calls-headers-id',
    filter-name='calls'
  )
    template(#item.answered='{value}')
      template(v-if='value === "Да"')
        span {{ value }}
      template(v-if='value === "Нет"')
        span.error--text {{ value }}
    template(#item.clientNumber='{value}')
      span {{ value | VMask("+7 (###) ###-##-##") }}
    template(#item.managerNumber='{value}')
      span {{ value | VMask("+7 (###) ###-##-##") }}
    template(#item.order='{value}')
      template(v-if='value')
        ug-modal-order(:order-id='value.id')
          template(#activator='{on, attrs}')
            v-btn(
              v-on='on',
              v-bind='attrs',
              :style='{ background: value.quick ? "rgba(255, 82, 82, .4)" : "" }',
              text,
              small
            )
              v-icon(left) mdi-pencil
              span {{ value.id }}
      template(v-else)
        span.error--text Не найдена
    template(#item.record='{value, item}')
      template(v-if='value')
        template(v-if='$can("listenCalls", "Global")')
          ug-bottom-audioplayer(
            :title='item.manager',
            :subtitle='item.managerNumber + " -> " + item.clientNumber',
            :audio='value'
          )
            template(#activator='{on, attrs, duration}')
              div(
                v-on='on',
                v-bind='attrs'
              )
                template(v-if='duration > 0')
                  v-btn(
                    text,
                    small
                  )
                    v-icon(left) mdi-play
                    span Прослушать
                template(v-else)
                  span.error--text Запись недоступна
        template(v-else)
          span.error--text Прослушивание недоступно
      template(v-else)
        span.error--text Не найдена
</template>

<script>
import UgTableRemote from '@/components/base/table/table-remote/table-remote'
import UgOrderEditTime from '@/components/order/order-edit-time/order-edit-time'
import UgOrderStatus from '@/components/order/order-status/order-status'
import UgBottomAudioplayer from '@/components/base/ui/bottom-audioplayer/bottom-audioplayer'
import UgModalOrder from '@/components/order/modal-order/modal-order'

import CallsAPI from '@/api/calls'
import { mapState } from 'vuex'
import { Filters } from '@/helpers/filterHelper'
import { map } from 'lodash'
import moment from 'moment'

export default {
  name: 'ug-page-orders',

  components: {
    UgTableRemote,
    UgOrderEditTime,
    UgOrderStatus,
    UgBottomAudioplayer,
    UgModalOrder,
  },

  data: function () {
    return {
      headersSchema: {
        order: 'Заявка',
        record: 'Запись',
        incoming: 'Входящий',
        answered: 'Отвечен',
        clientNumber: 'Клиент',
        manager: 'Ответил',
        managerNumber: 'Менеджер',
        startTime: 'Время звонка',
        endTime: 'Время окончания',
        answerTime: 'Время ответа',
      },

      filterTokens: Filters.calls || [],
    }
  },

  computed: {
    ...mapState({
      office: (state) => state.settings.office,
    }),
  },

  watch: {
    office: function () {
      const { table } = this.$refs

      table.updateTable()
    },
  },

  methods: {
    getTime(date) {
      const m = moment(date)
      return `${m.format('DD.MM.YYYY')} ${m.format('HH:mm')}`
    },

    modifyItems(items) {
      return map(items, (e) => {
        const startTime = this.getTime(e.startTime)
        const endTime = this.getTime(e.endTime)
        const answerTime = this.getTime(e.answerTime)

        return {
          id: e.dbId,
          incoming: e.incoming ? 'Да' : 'Нет',
          answered: e.answered ? 'Да' : 'Нет',
          clientNumber: e.clientNumber,
          manager: e.manager,
          managerNumber: e.managerNumber,
          order: e.relatedOrder,
          startTime,
          record: e.record,
          endTime,
          answerTime,
        }
      })
    },

    async fetchFunction(data) {
      const response = await CallsAPI.getPaginated(data)

      if (response.status !== 200) {
        this.$notification.error('Не удалось получить данные')
        return []
      }

      return response.data
    },
  },
}
</script>
