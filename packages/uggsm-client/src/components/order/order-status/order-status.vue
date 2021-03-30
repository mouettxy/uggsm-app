<template lang="pug">
.ug-order-status__container
  ug-base-chip.h-100(
    v-if='!$can("editOrderStatus", "Global") || !editable',
    :style='{ color: accessibleColor(statusColor) }',
    :color='statusColor'
  )
    span {{ status }}
  ug-responsive-menu.ug-order-status.h-100(
    v-if='$can("editOrderStatus", "Global") && editable',
    :menu-props='{ "close-on-content-click": false, "min-width": 200, "max-height": 300, bottom: true }'
  )
    template(v-slot:activator='{ on, attrs }')
      ug-base-btn.h-100(
        v-on='on',
        v-bind='attrs',
        :style='{ color: accessibleColor(statusColor) }',
        :label='status',
        :color='statusColor',
        small,
        iconRight='mdi-chevron-down',
        depressed
      )
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
</template>

<script>
import { filter, each } from 'lodash'
import UgResponsiveMenu from '@/components/base/ui/responsive-menu/responsive-menu'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import { getCorrectTextColor } from '@/api/helpers'
import { groupedStatuses } from '@/api/helpers/enums'
import OrderAPI from '@/api/order'
import { mapState } from 'vuex'

export default {
  name: 'ug-order-status',

  components: {
    UgResponsiveMenu,
    UgBaseBtn,
  },

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

    editable: {
      required: false,
      type: Boolean,
      default: true,
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
.ug-order-status__container
  height: 28px

.ug-order-status
  .ug-base-btn
    width: 100%
  &__list
    &-subheader
      height: 24px !important
    &-item
      min-height: 24px !important
      height: 24px !important
      &.selected
        opacity: .7
</style>
