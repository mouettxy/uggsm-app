<template>
  <div class="ug-order-print">
    <div v-if="order && menu" class="d-none">
      <ug-print-receipt
        :serial-number="order.serialNumber"
        :phone-model="order.phoneModel"
        :password="order.password"
        :order-id="order.id"
        :kit="order.kit"
        :estimated-close-at="order.estimatedCloseAt"
        :declared-price="order.declaredPrice"
        :declared-deffect="order.declaredDefect"
        :customer-phone="order.customerPhone"
        :customer-name="order.customerName"
        :created-at="order.createdAt"
        :appearance="order.appearance"
        avance=""
      ></ug-print-receipt>
      <ug-print-warranty
        :serial-number="order.serialNumber"
        :phone-model="order.phoneModel"
        :order-id="order.id"
        :declared-deffect="order.declaredDefect"
        :customer-phone="order.customerPhone"
        :customer-name="order.customerName"
        :created-at="order.createdAt"
      ></ug-print-warranty>
      <ug-print-check
        :works="order.statusWork"
        :order-id="order.id"
        :customer-name="order.customerName"
      ></ug-print-check>
      <ug-print-repair-contract-i-market
        :serial-number="order.serialNumber"
        :password="order.password"
        :model="order.phoneModel"
        :kit="order.kit"
        :declared-defect="order.declaredDeffect"
        :client-phone="order.customerPhone"
        :client-name="order.customerName"
        :appearance="order.appearance"
      ></ug-print-repair-contract-i-market>
      <ug-print-warranty-i-market></ug-print-warranty-i-market>
      <ug-print-volgograd
        :serial-number="order.serialNumber"
        :order-id="order.id"
        :model="order.phoneModel"
        :master="order.master ? order.master.credentials : ''"
        :kit="order.kit"
        :estimated-close-at="order.estimatedCloseAt"
        :deffect="order.declaredDeffect"
        :declared-price="order.declaredPrice"
        :customer="order.customer ? order.customer.name : ''"
        :appearance="order.appearance"
      ></ug-print-volgograd>
      <ug-print-volgograd-check
        :works="order.statusWork"
        :order-id="order.id"
        :customer-name="order.customerName"
      ></ug-print-volgograd-check>
    </div>
    <ug-responsive-menu :menu.sync="menu" :menu-props="{ bottom: true }">
      <template #activator="{ on, attrs }">
        <slot name="activator" :on="on" :attrs="attrs"></slot>
      </template>
      <v-list dense>
        <v-list-item-group>
          <v-list-item @click="$htmlToPaper('print-warranty')">
            <v-list-item-content>
              <v-list-item-title>Гарантия</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="$htmlToPaper('print-receipt')">
            <v-list-item-content>
              <v-list-item-title>Приемная квитанция</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="$htmlToPaper('print-check')">
            <v-list-item-content>
              <v-list-item-title>Товарный чек</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="$htmlToPaper('print-warranty-i-market')">
            <v-list-item-content>
              <v-list-item-title>Гарантий талон iMarket</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="$htmlToPaper('print-repair-contract-i-market')">
            <v-list-item-content>
              <v-list-item-title>Акт приема iMarket</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="$htmlToPaper('print-volgograd')">
            <v-list-item-content>
              <v-list-item-title>Заказ Волгоград</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="$htmlToPaper('print-volgograd-check')">
            <v-list-item-content>
              <v-list-item-title>Товарный чек Волгоград</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </ug-responsive-menu>
  </div>
</template>

<script>
import UgResponsiveMenu from '@/components/base/ui/responsive-menu/responsive-menu'
import UgPrintCheck from '@/components/print/print-check/print-check'
import UgPrintReceipt from '@/components/print/print-receipt/print-receipt'
import UgPrintRepairContractIMarket from '@/components/print/print-repair-contract-i-market/print-repair-contract-i-market'
import UgPrintWarranty from '@/components/print/print-warranty/print-warranty'
import UgPrintWarrantyIMarket from '@/components/print/print-warranty-i-market/print-warranty-i-market'
import UgPrintVolgograd from '@/components/print/print-volgograd/print-volgograd'
import UgPrintVolgogradCheck from '@/components/print/print-volgograd-check/print-volgograd-check'

export default {
  name: 'ug-order-print',

  components: {
    UgResponsiveMenu,
    UgPrintVolgograd,
    UgPrintVolgogradCheck,
    UgPrintCheck,
    UgPrintReceipt,
    UgPrintRepairContractIMarket,
    UgPrintWarranty,
    UgPrintWarrantyIMarket,
  },

  props: {
    order: {
      required: false,
      type: Object,
      default: () => ({}),
    },
  },

  data: () => ({
    menu: false,
  }),
}
</script>
