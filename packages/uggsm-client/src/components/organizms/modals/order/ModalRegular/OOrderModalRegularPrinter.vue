<template lang="pug">
.order-print-menu
  .d-none(v-if='order && printMenu')
    m-print-receipt(
      :serial-number='order.serialNumber',
      :phone-model='order.phoneModel',
      :password='order.password',
      :order-id='orderId',
      :kit='order.kit',
      :estimated-close-at='order.estimatedCloseAt',
      :declared-price='order.declaredPrice',
      :declared-deffect='order.declaredDefect',
      :customer-phone='order.customerPhone',
      :customer-name='order.customerName',
      :created-at='order.createdAt',
      :appearance='order.appearance',
      avance=''
    )
    m-print-warranty(
      :serial-number='order.serialNumber',
      :phone-model='order.phoneModel',
      :order-id='orderId',
      :declared-deffect='order.declaredDefect',
      :customer-phone='order.customerPhone',
      :customer-name='order.customerName',
      :created-at='order.createdAt'
    )
    m-print-check(
      :works='order.statusWork',
      :order-id='orderId',
      :customer-name='order.customerName'
    )
    m-print-repair-contract-i-market(
      :serial-number='order.serialNumber',
      :password='order.password',
      :model='order.phoneModel',
      :kit='order.kit',
      :declared-defect='order.declaredDeffect',
      :client-phone='order.customerPhone',
      :client-name='order.customerName',
      :appearance='order.appearance'
    )
    m-print-warranty-i-market
  v-menu(
    v-model='printMenu',
    close-on-click,
    bottom
  )
    template(v-slot:activator='{ on, attrs }')
      v-btn(
        v-on='on',
        v-bind='attrs',
        small,
        color='secondary'
      )
        v-icon mdi-printer
    v-list(dense)
      v-list-item-group
        v-list-item(@click='$htmlToPaper("print-warranty")')
          v-list-item-content
            v-list-item-title Гарантия
        v-list-item(@click='$htmlToPaper("print-receipt")')
          v-list-item-content
            v-list-item-title Приемная квитанция
        v-list-item(@click='$htmlToPaper("print-check")')
          v-list-item-content
            v-list-item-title Товарный чек
        v-list-item(@click='$htmlToPaper("print-warranty-i-market")')
          v-list-item-content
            v-list-item-title Гарантий талон iMarket
        v-list-item(@click='$htmlToPaper("print-repair-contract-i-market")')
          v-list-item-content
            v-list-item-title Акт приема iMarket
</template>

<script lang="ts">
import { Order } from '@/typings/api/order'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class OOrderModalRegularPrinter extends Vue {
  @Prop({ required: true }) order!: Order

  public printMenu = false

  get orderId() {
    if (this.order.isWarranty) {
      return `${this.order.warrantyOrderId}/${this.order.warrantyCounter}`
    }

    return this.order.id
  }
}
</script>

<style lang="sass"></style>
