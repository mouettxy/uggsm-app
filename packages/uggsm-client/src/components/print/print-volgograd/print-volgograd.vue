<template lang="pug">
#print-volgograd(style='font-family: Arial, sans-serif;')
  ug-print-volgograd-part(v-bind='$props')

  div(:style='{ heght: "1px", borderBottom: "2px dashed", margin: "20px 0" }')

  ug-print-volgograd-part(v-bind='$props')
</template>

<script>
import UgPrintVolgogradPart from './print-volgograd-part/print-volgograd-part'

export default {
  name: 'ug-print-volgograd',

  components: {
    UgPrintVolgogradPart,
  },

  props: {
    master: {
      required: false,
      type: String,
      default: '',
    },

    customer: {
      required: false,
      type: String,
      default: '',
    },

    model: {
      required: false,
      type: String,
      default: '',
    },

    serialNumber: {
      required: false,
      type: [String, Number],
      default: '',
    },

    kit: {
      required: false,
      type: String,
      default: '',
    },

    appearance: {
      required: false,
      type: String,
      default: '',
    },

    deffect: {
      required: false,
      type: String,
      default: '',
    },

    declaredPrice: {
      required: false,
      type: [String, Number],
      default: '',
    },

    estimatedCloseAt: {
      required: false,
      type: String,
      default: '',
    },

    orderId: {
      required: false,
      type: [String, Number],
      default: '',
    },
  },
}
</script>
