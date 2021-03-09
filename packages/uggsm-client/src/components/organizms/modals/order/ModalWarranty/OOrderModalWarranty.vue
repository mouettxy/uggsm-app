<template lang="pug">
.order-modal-warranty
  ug-modal-right(v-model='modal')
    template(#activator='{on, attrs}')
      slot(
        name='activator',
        :on='on',
        :attrs='attrs'
      )
    v-container.order-modal-content(
      v-if='modal',
      fluid
    )
      .order-modal-header.softgrey
        v-row.align-center(no-gutters)
          v-slide-y-transition(leave-absolute)
            v-col(
              cols='auto',
              v-if='!order'
            )
              h5.text-h5 Заявка по гарантии
          v-slide-y-transition(leave-absolute)
            v-col.pl-2(
              cols='auto',
              v-if='order && !order.warrantyOrderId'
            )
              h5.text-h5 Заявка №{{ order.id }} по гарантии
          v-slide-y-transition(leave-absolute)
            v-col.pl-2(
              cols='auto',
              v-if='order && order.warrantyOrderId'
            )
              h5.text-h5 Заявка №{{ order.warrantyOrderId }} по гарантии
          v-slide-y-transition(leave-absolute)
            v-col.pl-2(
              cols='auto',
              v-if='order'
            )
              v-chip(
                :style='{ color: statusTextColor }',
                :color='statusColor',
                label
              ) {{ order.status }}
          v-slide-y-transition
            v-col.pl-2(
              cols='auto',
              v-if='order'
            )
              v-chip(
                v-if='order.warrantyCounter',
                label,
                color='error'
              ) Открыта по гарантии {{ order.warrantyCounter }} раз
              v-chip(
                v-if='!order.warrantyCounter',
                label,
                color='success'
              ) Не открывалась по гарантии
      .order-modal-content__body
        o-order-modal-warranty-fields(
          @order-fetch='onOrderFetch',
          @defect-change='onDefectChange'
        )
    v-footer.order-modal-footer
      ug-base-btn.mr-2(
        @click='create',
        label='Создать',
        icon='mdi-content-save',
        color='primary'
      )
      ug-base-btn(
        @click='rewind',
        label='Закрыть',
        icon='mdi-close',
        color='lightgrey'
      )
</template>

<script lang="ts">
import UgModalRight from '@/components/base/ui/modal-right/modal-right.vue'
import { ordersModule } from '@/store'
import { Order } from '@/typings/api/order'
import { Component, Vue } from 'vue-property-decorator'
import { cloneDeep, find, flatten, map } from 'lodash'
import { groupedStatuses } from '@/api/helpers/enums'
import { getCorrectTextColor } from '@/api/helpers'
import moment from 'moment'
import { User } from '@/typings/api/auth'
import { Office } from '@/typings/api/office'
import { Client } from '@/typings/api/client'

@Component({
  components: {
    UgModalRight,
  },
})
export default class OOrderModalWarranty extends Vue {
  public modal = false

  public order: Order | null = null

  public defect = ''

  rewind(rewindModel = true) {
    this.modal = false
    this.order = null
    this.defect = ''
  }

  get statusColor() {
    return find(flatten(map(groupedStatuses, (e) => e.statuses)), { status: this.order?.status })?.color
  }

  get statusTextColor() {
    if (this.statusColor) {
      return getCorrectTextColor(this.statusColor)
    }
    return '#000000'
  }

  onOrderFetch(order: Order | null) {
    this.order = order
  }

  onDefectChange(defect: string) {
    this.defect = defect
  }

  async create() {
    if (this.order && this.defect && this.order.master && this.order.manager) {
      const copy = cloneDeep(this.order)

      if (!copy.isWarranty) {
        copy.warrantyOrderId = copy.id as number
      }

      delete copy.id
      delete copy._id
      delete copy.__v

      copy.createdAt = moment().toISOString()
      copy.isWarranty = true
      copy.warrantyCounter += 1
      copy.warrantySaved.push({ declaredDefect: copy.declaredDefect })
      copy.declaredDefect = this.defect
      copy.statusWork = []

      copy.master = (copy.master._id as unknown) as User
      copy.manager = (copy.manager._id as unknown) as User
      copy.office = (copy.office._id as unknown) as Office
      copy.customer = (copy.customer._id as unknown) as Client
      copy.orderType = 'Гарантия'

      const response = await ordersModule.createOrder({ model: copy, comparator: true })

      if (response) {
        this.rewind()
      }
    } else {
      this.$notification.error('В заявке не указан мастер или менеджер или не заполнено поле "Дефект".')
    }
  }
}
</script>

<style lang="sass">
$height: calc(100vh - 48px)
$height-body: calc(100vh - 96px)

.order-modal-content
  padding: 0 !important
  height: $height !important
  overflow: hidden
  .order-modal-content__body
    overflow-y: scroll
    height: $height-body

.order-modal-header
  padding: 12px
</style>
