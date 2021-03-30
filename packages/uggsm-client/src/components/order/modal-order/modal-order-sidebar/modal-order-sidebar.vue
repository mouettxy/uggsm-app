<template>
  <div class="modal-order-sidebar">
    <v-fade-transition hide-on-leave>
      <div v-if="!workflows.length">
        <v-skeleton-loader v-for="i in 3" :key="i" type="list-item-avatar-two-line"></v-skeleton-loader>
      </div>
      <ug-order-timeline v-else :workflow="workflows">
        <!-- eslint-disable-next-line -->
      <template #custom.content-body="{ value }">
          <ug-order-workflow-audioplayer :call="getOrderCall(value)"></ug-order-workflow-audioplayer>
        </template>
      </ug-order-timeline>
    </v-fade-transition>
  </div>
</template>

<script>
import UgOrderTimeline from '@/components/order/order-timeline/order-timeline'
import UgOrderWorkflowAudioplayer from '@/components/order/order-workflow-audioplayer/order-workflow-audioplayer'

import moment from 'moment'
import { each, cloneDeep, find, includes } from 'lodash'
import { getCorrectTextColor } from '@/api/helpers'

export default {
  name: 'modal-order-sidebar',

  components: {
    UgOrderTimeline,
    UgOrderWorkflowAudioplayer,
  },

  props: {
    // order.workflow
    orderWorkflow: {
      required: false,
      type: Array,
      default: () => [],
    },

    // order.statusCalls
    orderCalls: {
      required: false,
      type: Array,
      default: () => [],
    },
  },

  computed: {
    workflows() {
      if (this.orderWorkflow) {
        const unitedDates = []

        const uniteDate = (date) => {
          return moment(this.normalizeDate(date).split(' ')[0], 'DD.MM.YYY').format('D MMMM')
        }

        each(this.orderWorkflow, (el) => {
          const unitedDate = uniteDate(el.date)
          if (
            !find(unitedDates, (e) => {
              return e[0] === unitedDate
            })
          ) {
            unitedDates.push([unitedDate, []])
          }
        })

        each(this.orderWorkflow, (el) => {
          const e = cloneDeep(el)

          let type = 'message'
          let color = '#1858a1'
          let icon = 'mdi-account'

          const date = this.normalizeDate(e.date).split(' ')[1]

          if (e.header === 'Смена статуса заказа') {
            type = 'solo'
            e.header = e.message
            if (includes(['Новый', 'Отремонтирован'], e.header)) {
              color = '#1859a1'
            } else if (includes(['В работе', 'На тестировании'], e.header)) {
              color = '#689f38'
            } else if (includes(['Позвонить повторно', 'Ждёт запчасть', 'Нужно решить'], e.header)) {
              color = '#FB8C00'
            } else if (includes(['Готов', 'Готов, без ремонта', 'На продаже'], e.header)) {
              color = '#525252'
            } else if (includes(['Закрыт с вопросом'], e.header)) {
              color = '#b9b9b9'
            } else if (includes(['Закрыт', 'Обещали найти', 'Выкуплен СЦ'], e.header)) {
              color = '#626262'
            } else if (includes(['Пересогласовать'], e.header)) {
              color = '#ff6961'
            }
          }

          if (e.header === 'Закрыта работа') {
            color = '#c3a442'
            icon = 'mdi-account-cog'
          } else if (e.header === 'Назначен клиент') {
            color = '#1b78c3'
            icon = 'mdi-account'
          } else if (e.header === 'Назначен мастер' || e.header === 'Смена мастера') {
            color = '#1e89d8'
            icon = 'mdi-account-hard-hat'
          } else if (e.header === 'Назначен менеджер' || e.header === 'Смена менеджера') {
            color = '#1f9dec'
            icon = 'mdi-account-cowboy-hat'
          } else if (e.header === 'Изменение офиса') {
            color = '#1d18a1'
            icon = 'mdi-swap-horizontal'
          } else if (e.header === 'Новый комментарий') {
            color = '#689f38'
            icon = 'mdi-pencil'
          } else if (e.header === 'Смена статуса оплаты') {
            color = '#FF5252'
            icon = 'mdi-cash'
          } else if (e.header === 'Новое сообщение') {
            color = '#bcf5bc'
            icon = 'mdi-message-bulleted'
          } else if (e.header === 'Смена срока заказа') {
            color = '#4BB543'
            icon = 'mdi-clock-check'
          }

          if (e.header === 'Исходящий звонок' || e.header === 'Входящий звонок') {
            type = 'slot'
            color = '#d5f5ee'
            icon = 'mdi-phone-alert'
          }

          const workflow = {
            id: e.id,
            type,
            color,
            textColor: getCorrectTextColor(color),
            date,
            icon,
            message: e.message,
            header: e.header,
            username: e.username,
          }

          const uniteDateArr = find(unitedDates, (unitedDate) => {
            return unitedDate[0] === uniteDate(e.date)
          })[1]

          uniteDateArr.push(workflow)
        })
        return unitedDates
      }

      return []
    },
  },

  methods: {
    normalizeDate(date) {
      const momented = moment(date).format('DD.MM.YYYY HH:mm')

      return momented
    },

    getOrderCall(callId) {
      if (this.orderCalls) {
        return find(this.orderCalls, { _id: callId })
      }

      return ''
    },
  },
}
</script>

<style></style>
