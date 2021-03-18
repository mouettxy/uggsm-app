<template lang="pug">
.order-print-menu
  .d-none(v-if='order && printMenu')
    ug-print-receipt(
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
    ug-print-warranty(
      :serial-number='order.serialNumber',
      :phone-model='order.phoneModel',
      :order-id='orderId',
      :declared-deffect='order.declaredDefect',
      :customer-phone='order.customerPhone',
      :customer-name='order.customerName',
      :created-at='order.createdAt'
    )
    ug-print-check(
      :works='order.statusWork',
      :order-id='orderId',
      :customer-name='order.customerName'
    )
    ug-print-repair-contract-i-market(
      :serial-number='order.serialNumber',
      :password='order.password',
      :model='order.phoneModel',
      :kit='order.kit',
      :declared-defect='order.declaredDeffect',
      :client-phone='order.customerPhone',
      :client-name='order.customerName',
      :appearance='order.appearance'
    )
    ug-print-warranty-i-market

    ug-print-volgograd(
      :serial-number='order.serialNumber',
      :order-id='orderId',
      :model='order.phoneModel',
      :master='order.master ? order.master.credentials : ""',
      :kit='order.kit',
      :estimated-close-at='order.estimatedCloseAt',
      :deffect='order.declaredDeffect',
      :declared-price='order.declaredPrice',
      :customer='order.customer ? order.customer.name : ""',
      :appearance='order.appearance'
    )
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
        v-list-item(@click='$htmlToPaper("print-volgograd")')
          v-list-item-content
            v-list-item-title Заказ Волгоград
</template>

<script lang="ts">
import { Order } from '@/typings/api/order'
import { Component, Prop, Vue } from 'vue-property-decorator'
import UgPrintVolgograd from '@/components/print/print-volgograd/print-volgograd.vue'
import UgPrintAdversitement from '@/components/print/print-adversitement/print-adversitement.vue'
import UgPrintCheck from '@/components/print/print-check/print-check.vue'
import UgPrintReceipt from '@/components/print/print-receipt/print-receipt.vue'
import UgPrintRepairContract from '@/components/print/print-repair-contract/print-repair-contract.vue'
import UgPrintWarranty from '@/components/print/print-warranty/print-warranty.vue'
import UgPrintWarrantyIMarket from '@/components/print/print-warranty-i-market/print-warranty-i-market.vue'
import UgPrintRepairContractIMarket from '@/components/print/print-repair-contract-i-market/print-repair-contract-i-market.vue'

@Component({
  components: {
    UgPrintVolgograd,
    UgPrintAdversitement,
    UgPrintCheck,
    UgPrintReceipt,
    UgPrintRepairContract,
    UgPrintWarranty,
    UgPrintWarrantyIMarket,
    UgPrintRepairContractIMarket,
  },
})
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
