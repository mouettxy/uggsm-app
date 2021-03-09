<template lang="pug">
.order-modal-fields.order-modal-fields--warranty(:class='{ "order-modal-fields--mobile": isMobile }')
  v-row.order-modal-fields__section(no-gutters)
    v-col.order-modal-fields__section-item(
      cols='12',
      md='4',
      lg='4'
    )
      ug-base-input(
        v-model='orderid',
        type='number',
        prefix='№',
        label='Заявка'
      )
    v-col.order-modal-fields__section-item(
      cols='12',
      md='8',
      lg='8'
    )
      v-slide-x-transition(group)
        v-row(
          key='defects',
          v-if='order',
          no-gutters
        )
          v-col
            v-subheader Прошлые неисправности
            template(v-if='order.warrantyCounter')
              v-slide-x-transition(group)
                v-list-item(:key='999')
                  v-list-item-content
                    v-list-item-title {{ order.declaredDefect }}
                v-list-item(
                  v-for='(saved, i) in order.warrantySaved',
                  :key='i'
                )
                  v-list-item-content
                    v-list-item-title {{ saved.declaredDefect }}
            template(v-else)
              v-list-item
                v-list-item-content
                  v-list-item-title {{ order.declaredDefect }}
  v-slide-y-transition
    v-row.order-modal-fields__section(
      v-if='order',
      no-gutters
    )
      v-col.order-modal-fields__section-item(cols='12')
        ug-base-autocomplete(
          v-model='defect',
          label='Новая неисправность',
          icon='mdi-cellphone-erase',
          endpoint='/declared-defect',
          dense
        )
</template>

<script lang="ts">
import UgBaseAutocomplete from '@/components/base/ui/base-autocomplete/base-autocomplete.vue'
import UgBaseInput from '@/components/base/ui/base-input/base-input.vue'

import { Component, Mixins, Watch } from 'vue-property-decorator'
import Responsive from '@/mixins/responive'
import { Order } from '@/typings/api/order'
import { debounce, find, flatten, map } from 'lodash'
import { ordersModule } from '@/store'
import { groupedStatuses } from '@/api/helpers/enums'
import { getCorrectTextColor } from '@/api/helpers'

@Component({
  components: {
    UgBaseAutocomplete,
    UgBaseInput,
  },
})
export default class OOrderModalWarrantyFields extends Mixins(Responsive) {
  public orderid: number | null = null

  public order: Order | null = null

  public defect = ''

  public dGetOrder = debounce(this.getOrder, 200)

  @Watch('orderid')
  onOrderIdChange(value: number | null) {
    if (value) {
      this.dGetOrder()
    } else {
      this.order = null
    }
  }

  @Watch('order')
  onOrderChange(value: Order | null) {
    this.$emit('order-fetch', value)
  }

  @Watch('defect')
  onDefectChange(value: string) {
    this.$emit('defect-change', value)
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

  async getOrder() {
    if (this.orderid) {
      const response = await ordersModule.getOrder(this.orderid)

      this.order = response
    }
  }
}
</script>

<style lang="sass">
.order-modal-fields
  padding: 12px
  &:not(.order-modal-fields--mobile)
    .order-modal-fields__section
      margin-top: 6px
      margin-bottom: -12px
      &-item__switch
        margin-top: 4px
      &-item
        padding-left: 6px
      &-item:first-child
        padding-left: 0
  &.order-modal-fields--mobile
    .order-modal-fields__section
      margin-top: 6px
      margin-bottom: -12px
      &-item__switch
        margin-top: -16px
        margin-bottom: 24px
  .order-modal-fields__label
    margin-bottom: 6px
    background: #fafafa
    padding: 4px
    font-size: 1.3rem
</style>
