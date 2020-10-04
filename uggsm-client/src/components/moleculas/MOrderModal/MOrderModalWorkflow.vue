<template lang="pug">
v-card.order-modal-workflow(v-if='!newOrder')
  v-toolbar.order-modal-workflow__header(dense, flat)
    v-menu(bottom, close-on-click)
      template(v-slot:activator='{ on, attrs }')
        v-btn(color='secondary', small, v-bind='attrs', v-on='on')
          v-icon mdi-printer
      v-list(dense)
        v-list-item-group
          v-list-item
            v-list-item-content
              v-list-item-title Акт выполненных работ
          v-list-item
            v-list-item-content
              v-list-item-title Приемная квитанция
          v-list-item
            v-list-item-content
              v-list-item-title Товарный чек
    v-spacer
    v-menu(bottom, close-on-click)
      template(v-slot:activator='{ on, attrs }')
        v-btn(color='secondary', small, v-bind='attrs', v-on='on')
          v-icon mdi-swap-horizontal
      v-list(dense)
        v-list-item-group
          v-list-item(v-for='office in offices', :key='office.id', @click='changeOffice(office.code)')
            v-list-item-content
              v-list-item-title {{ office.code }}|{{ office.name }}
    v-spacer
    // TODO: add modal sms
    v-btn(color='secondary', small)
      v-icon(left) mdi-cellphone
      span SMS
  .order-modal-workflow__content
    a-timeline
      template(v-for='workflow in workflows')
        a-timeline-time(:date='workflow[0]', :color='workflow[1][0]["color"]')
        a-timeline-item(v-for='action in workflow[1]', :key='action.id', :item='action')
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { officesModule } from '@/store'
import moment from 'moment'

import { ATimeline, ATimelineItem, ATimelineTime } from '@/components/atoms/ATimeline'
import { each, startsWith, cloneDeep, capitalize, find } from 'lodash'
import { ordersAPI } from '@/api'

@Component({
  components: {
    ATimeline,
    ATimelineItem,
    ATimelineTime
  }
})
export default class MOrderModalWorkflow extends Vue {
  @Prop(Boolean) newOrder: any
  @Prop(Object) order: any

  get offices() {
    return officesModule.offices
  }

  get console() {
    return console
  }

  get workflows() {
    const unitedDates: any = []

    const uniteDate = (date: Date) => {
      return moment(this.normalizeDate(date).split(' ')[0], 'DD.MM.YYY')
        .locale('ru')
        .format('D MMMM')
    }

    if (this.order) {
      each(this.order.workflow, (el) => {
        const unitedDate = uniteDate(el.date)
        if (
          !find(unitedDates, (e) => {
            return e[0] === unitedDate
          })
        ) {
          unitedDates.push([unitedDate, []])
        }
      })

      each(this.order.workflow, (el) => {
        const e = cloneDeep(el)

        e.header = capitalize(e.header)
        e.message = capitalize(e.message)

        let type = 'message'
        let color = 'primary'
        const date = this.normalizeDate(e.date).split(' ')[1]

        if (startsWith(e.message, 'Установлен статус')) {
          type = 'solo'
        }

        if (startsWith(e.header, 'Закрыта работа')) {
          color = 'warning'
        }

        const workflow = {
          id: e.id,
          type,
          color,
          date,
          message: e.message,
          header: e.header,
          username: e.username
        }

        const uniteDateArr = find(unitedDates, (unitedDate: any) => {
          return unitedDate[0] === uniteDate(e.date)
        })[1]
        uniteDateArr.push(workflow)
      })
    }

    return unitedDates
  }

  async changeOffice(office: string) {
    try {
      const response = await ordersAPI(this.order.id).setOffice({ office })

      if (response) {
        this.$router.push({ name: 'orders' })
        this.$notification.success('Успешная смена офиса')
      } else {
        this.$notification.error('Ошибка при смене офиса')
      }
    } catch (error) {
      this.$notification.error(error.message)
    }
  }

  normalizeDate(date: Date) {
    const momented = moment(date).format('DD.MM.YYYY HH:mm')

    return momented
  }
}
</script>

<style lang="sass">
.order-modal-workflow
  height: calc(100vh - 60px)
  overflow-y: scroll
</style>
