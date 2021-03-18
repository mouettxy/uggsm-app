<template>
  <div id="print-receipt" style="width: 100%; height: 100%">
    <ug-print-repair-contract v-bind="$props"></ug-print-repair-contract>
    <div style="font-size: 14px; text-align: center">
      --------------------------------------------------------------------------------------------------------------------
    </div>
    <ug-print-repair-contract v-bind="$props"></ug-print-repair-contract>
    <div style="font-size: 14px; text-align: center">
      <br />
      <p>
        Я надеюсь на удачу, хочу забрать из ремонта, не дожидаясь полного высыхания и проверки. Претензий к работе не
        имею, понимаю, что гарантии на ремонт НЕТ. {{ customerName }} (роспись)___________
      </p>
    </div>
    <div style="font-size: 14px; text-align: center">
      --------------------------------------------------------------------------------------------------------------------
    </div>
    <ug-print-warranty v-bind="$props"></ug-print-warranty>
    <div style="font-size: 14px; text-align: center">
      --------------------------------------------------------------------------------------------------------------------
    </div>
    <ug-print-adversitement v-bind="$props"></ug-print-adversitement>
  </div>
</template>

<script>
import UgPrintRepairContract from '../print-repair-contract/print-repair-contract'
import UgPrintWarranty from '../print-warranty/print-warranty'
import UgPrintAdversitement from '../print-adversitement/print-adversitement'

export default {
  name: 'm-print-receipt',

  components: {
    UgPrintRepairContract,
    UgPrintWarranty,
    UgPrintAdversitement,
  },

  props: {
    orderId: {
      required: false,
      type: [String, Number],
      default: '',
    },

    createdAt: {
      required: false,
      type: [String, Number],
      default: '',
    },

    customerName: {
      required: false,
      type: [String, Number],
      default: '',
    },

    customerPhone: {
      required: false,
      type: [String, Number],
      default: '',
    },

    phoneModel: {
      required: false,
      type: [String, Number],
      default: '',
    },

    serialNumber: {
      required: false,
      type: [String, Number],
      default: '',
    },

    declaredDeffect: {
      required: false,
      type: [String, Number],
      default: '',
    },

    password: {
      required: false,
      type: [String, Number],
      default: '',
    },

    appearance: {
      required: false,
      type: [String, Number],
      default: '',
    },

    kit: {
      required: false,
      type: [String, Number],
      default: '',
    },

    estimatedCloseAt: {
      required: false,
      type: [String, Number],
      default: '',
    },

    declaredPrice: {
      required: false,
      type: [String, Number],
      default: 0,
    },

    avance: {
      required: false,
      type: [String, Number],
      default: 0,
    },
  },

  computed: {
    year() {
      return new Date().getFullYear()
    },

    customerPhoneFormatted() {
      return this.customerPhone
    },
  },
}
</script>

<style lang="sass"></style>
