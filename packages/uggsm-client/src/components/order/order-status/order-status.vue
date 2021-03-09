<template lang="pug">
.ug-order-status__container
  v-btn(
    v-if='!$can("editOrderStatus", "Global")',
    :style='{ color: accessibleColor(statusColor) }',
    :color='statusColor',
    small,
    depressed
  )
    span {{ status }}
  v-menu.ug-order-status(
    v-if='$can("editOrderStatus", "Global")',
    :close-on-content-click='false',
    min-width='200px',
    max-height='300px',
    bottom
  )
    template(v-slot:activator='{ on, attrs }')
      v-btn(
        v-on='on',
        v-bind='attrs',
        :style='{ color: accessibleColor(statusColor) }',
        :color='statusColor',
        small,
        depressed
      )
        span {{ status }}
        v-icon(right) mdi-chevron-down
    .ug-order-status__lists
      template(v-for='head in statusList')
        v-list.ug-order-status__list(
          subheader,
          nav,
          dense
        )
          v-subheader.ug-order-status__list-subheader {{ head.text }}
          v-list-item.ug-order-status__list-item(
            v-for='s in head.statuses',
            :value='s.status',
            :style='{ color: `${accessibleColor(s.color)} !important`, backgroundColor: s.color }',
            :key='s.status',
            :disabled='status === s.status',
            :class='{ selected: status === s.status }',
            @click='setStatus(s.status)'
          )
            v-list-item-content
              v-list-item-title {{ s.status }}
          v-divider
</template>

<script>
import { filter, each } from 'lodash'
import { getCorrectTextColor } from '@/api/helpers'
import { groupedStatuses } from '@/api/helpers/enums'
import OrderAPI from '@/api/order'
import { mapState } from 'vuex'

export default {
  name: 'ug-order-status',

  props: {
    status: {
      required: true,
      type: [String],
    },

    scope: {
      required: false,
      type: [String],
      default: 'mounted',
    },

    orderid: {
      required: true,
      type: [String, Number],
    },
  },

  data: function () {
    return {
      order: null,
    }
  },

  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      office: (state) => state.settings.office,
    }),

    statusList() {
      if (this.status === 'Закрыт' && this.user.role !== 'administrator') {
        return [
          {
            text: 'Закрытые успешно',
            statuses: [
              {
                color: '#626262',
                status: 'Закрыт',
              },
            ],
          },
        ]
      }

      return groupedStatuses
    },

    statusColor() {
      let status = ''
      each(this.statusList, (el) => {
        const filtered = filter(el.statuses, (e) => {
          return e.status === this.status
        })
        if (filtered.length > 0) {
          status = filtered[0]['color']
        }
      })
      return status
    },
  },

  methods: {
    accessibleColor(hex) {
      return getCorrectTextColor(hex)
    },

    async setStatus(status) {
      const response = await OrderAPI.setStatus(this.orderid, {
        status,
        userid: this.user.id,
        userMongoId: this.user._id,
        officeId: this.office._id,
      })

      if (response.status === 200 && response.data.status === 'OK') {
        if (response.data.sms) {
          await OrderAPI.sendSms(this.orderid, {
            ...response.data.smsPayload,
            type: response.data.smsType,
          })

          this.$notification.success('Сообщение клиенту отправлено успешно')
        }

        this.$notification.success(`Статус заявки #${this.orderid} успешно изменён на "${status}"`)
      }
    },
  },
}
</script>

<style lang="sass">
.ug-order-status
  width: 250px !important
  &__list
    &-subheader
      height: 24px !important
    &-item
      min-height: 24px !important
      height: 24px !important
      &.selected
        opacity: .7
</style>
